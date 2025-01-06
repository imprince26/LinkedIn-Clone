import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

 // client/src/components/auth/LoginForm.jsx
const { mutate: loginMutation, isLoading } = useMutation({
  mutationFn: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData, {
        // Add additional configuration
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
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
    toast.success("Login Successful", {
      style: {
        background: "#333",
        color: "#fff",
      }
    });
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

    // Specific error handling
    if (err.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized Access Detected');
    }
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="  text-[2.1rem] font-medium text-gray-300">Sign in</h2>
        <p className="text-md text-gray-400">
          Stay updated on your professional world
        </p>
      </div>
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
      >
        {isLoading ? <Loader className="size-5 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
};
export default LoginForm;
