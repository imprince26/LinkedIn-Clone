import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation({ name, username, email, password });
  };
  const baseClass =
    " bg-transparent text-md text-gray-100 h-10 border border-gray-400 focus:outline focus:border-primary pl-4 mt-1 w-full rounded-lg";
  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="text-md  text-gray-100 ">Full name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={baseClass}
          required
        />
      </div>
      <div className="">
        <span className="text-md  text-gray-100">Username</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={baseClass}
          required
        />
      </div>
      <div className="">
        <span className="text-md  text-gray-100 ">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={baseClass}
          required
        />
      </div>
      <div className="">
        <span className="text-md  text-gray-100">
          Password (6+ characters)
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={baseClass}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary mt-3 hover:bg-blue-800 text-white w-full h-[3.3rem] text-lg font-medium rounded-3xl"
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};
export default SignUpForm;
