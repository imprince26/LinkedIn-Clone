// client/src/components/auth/LoginForm.jsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate(); // Initialize navigation
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async (userData) => {
      try {
        const response = await axiosInstance.post("/auth/login", userData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Login Request Error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message
        });
        
        throw error;
      }
    },
    onSuccess: async () => {
      // Invalidate and refetch the auth user query
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
      // Show success toast
      toast.success("Login Successful", {
        style: {
          background: "#333",
          color: "#fff",
        }
      });

      // Programmatically navigate to home page
      navigate("/");
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.detail || 
                           "Login failed. Please try again.";
      
      toast.error(errorMessage, {
        style: {
          background: "#333",
          color: "#fff",
        }
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ username, password });
  };

  const baseClass =
    "bg-transparent placeholder:text-info placeholder:text-lg text-lg text-gray-100 h-[3.5rem] border border-gray-400 focus:outline focus:border-primary  pl-4 w-full rounded-lg";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-md">
      {/* Existing form content */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={baseClass}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={baseClass}
        required
      />

      <button
        type="submit"
        className="btn btn-primary hover:bg-blue-800 text-white w-full h-[3.3rem] text-lg rounded-3xl"
        disabled={isLoading}
      >
        {isLoading ? <Loader className="size-5 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;