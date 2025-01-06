/* eslint-disable no-unused-vars */
import { useEffect } from "react";
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
    refetch  // Add refetch method
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me", {
          withCredentials: true
        });
        
        // More robust authentication check
        if (res.data.isAuthenticated) {
          return res.data;
        }
        
        return null;
      } catch (err) {
        console.error("Authentication Error:", err);
        return null;
      }
    },
    retry: 1,
    staleTime: 0,  // Ensure fresh data on each check
    refetchOnWindowFocus: true
  });

  // Add navigation logic
  const navigate = useNavigate();

  // Effect to handle authentication state changes
  useEffect(() => {
    if (authUser) {
      navigate('/');  // Redirect to home page on successful authentication
    }
  }, [authUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

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
          element={
            !authUser ? (
              <LoginPage refetchAuth={refetch} />  // Pass refetch method
            ) : (
              <Navigate to={"/"} />
            )
          }
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
