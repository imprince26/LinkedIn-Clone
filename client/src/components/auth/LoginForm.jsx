import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: (userData) => axiosInstance.post("/auth/login", userData, {
      withCredentials: true
    }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
      toast.success("Logged in successfully", {
        style: {
          background: "#333",
          color: "#fff",
        }
      });
      navigate('/');
    },
    onError: (err) => {
      console.error("Login Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Something went wrong", {
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
