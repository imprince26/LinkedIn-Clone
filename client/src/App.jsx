import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const navigate = useNavigate();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser "],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const res = await axiosInstance.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          toast.error("Session expired. Please log in again.", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
          navigate("/login"); // Navigate to login page
          return null;
        }
        toast.error(err.response?.data?.message || "Something went wrong", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    },
  });

  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notifications"
          element={
            authUser ? <NotificationsPage /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/network"
          element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
      <Route
        path="*"
        element={<Navigate to="/" />} // Redirect to home or a 404 page
      />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
