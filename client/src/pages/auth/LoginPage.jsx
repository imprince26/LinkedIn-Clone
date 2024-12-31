import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-[70vh] bg-dark-primary flex flex-col  sm:mx-auto sm:w-full sm:max-w-md shadow-md shadow-gray-900 px-10 py-10 rounded-xl ">
      <LoginForm />
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-md">
            <span className="px-2 bg-dark-primary  text-gray-300">
              New to LinkedIn?
            </span>
          </div>
        </div>
        <div className="mt-3 flex justify-center ">
          <Link
            to="/signup"
            className="w-[30%] flex justify-center py-1 border border-transparent rounded-3xl text-md  font-medium text-blue-600  hover:bg-gray-800 hover:underline"
          >
            Join now
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
