import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm.jsx";

const SignUpPage = () => {
  return (
    <div className="min-h-[80vh] sm:px-6">
      <h2 className="text-center lg:text-[2rem] text-xl font-normal text-gray-300">
        Make the most of your professional life
      </h2>
      <div className="mt-8  mx-auto max-w-md  bg-dark-primary py-8 px-4 shadow-md shadow-gray-900 sm:rounded-lg sm:px-10">
        <SignUpForm />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-primary text-gray-300">
                Already on LinkedIn?
              </span>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <Link
              to="/login"
              className="w-[30%] flex justify-center py-1 border border-transparent rounded-3xl  text-md  font-medium text-blue-600  hover:bg-gray-800 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
