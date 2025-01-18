import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const NetworkPage = lazy(() => import("./pages/NetworkPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const {
    data: authUser,
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me", {
          withCredentials: true
        });
      
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
    staleTime: 0, 
    refetchOnWindowFocus: true
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authUser && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [authUser, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><p>Loading...</p></div>}>
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
                <LoginPage refetchAuth={refetch} /> 
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
      </Suspense>
      <Toaster />
    </Layout>
  );
}

export default App;
