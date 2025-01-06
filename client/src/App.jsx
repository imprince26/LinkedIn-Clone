/* eslint-disable no-unused-vars */
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
import NotFound from "./pages/NotFound";

function App() {
  const {
    data: authUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        
        // Check if the user is authenticated
        if (res.data.isAuthenticated) {
          return res.data;
        }
        
        // If not authenticated, return null
        return null;
      } catch (err) {
        console.error("Authentication Error:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        // Return null for any error
        return null;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
