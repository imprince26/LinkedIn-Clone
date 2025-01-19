import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/login");
    },
    onError: (err) => console.error("Logout Error:", err),
  });

  const unreadNotificationCount = notifications?.data.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const mobileLinkBaseClass =
    "w-1/4 h-full text-neutral flex flex-col justify-center  items-center opacity-80 hover:opacity-100 hover:brightness-200 relative";
  
  const linkBaseClass = "text-neutral flex-col items-center opacity-80 hover:opacity-100 hover:brightness-200 relative hidden md:flex";

  const notificationSpanClass =
    "absolute -top-1 -right-1 md:right-4 bg-red-500 text-white text-xs rounded-full size-4 md:size-5 flex items-center justify-center";

  return (
    <nav className="h-16 bg-dark-primary shadow-md sticky top-0 z-10">
      <div className="h-full max-w-7xl flex justify-between items-center mx-auto px-4">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              className="lg:h-8 h-6 rounded"
              src="/dark-logo.svg"
              alt="LinkedIn"
            />
          </Link>
        </div>
        <div className="flex items-center md:gap-6 space-x-4">
          {authUser ? (
            <>
              <Link
                to={"/"}
                className={linkBaseClass}
              >
                <Home size={24} />
                <span className="text-xs">Home</span>
              </Link>
              <Link
                to="/network"
                className={linkBaseClass}
              >
                <Users size={24} />
                <span className="text-xs">My Network</span>
                {unreadConnectionRequestsCount > 0 && (
                  <span className={notificationSpanClass}>
                    {unreadConnectionRequestsCount}
                  </span>
                )}
              </Link>
              <Link
                to="/notifications"
                className={linkBaseClass}
              >
                <Bell size={24} />
                <span className="text-xs">Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className={notificationSpanClass}>
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>
              <Link
                to={`/profile/${authUser.username}`}
                className={linkBaseClass}
              >
                <User size={24} />
                <span className="text-xs">Me</span>
              </Link>
              <button
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => logout()}
              >
                <LogOut size={24} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn bg-transparent border-none px-6 hover:bg-gray-800 outline-none lg:text-[1.1rem] text-gray-300 text-md font-medium gap-4 rounded-[2rem]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn bg-transparent hover:bg-gray-800 outline-none border border-primary hover:border-primary font-medium text-primary lg:text-[1.1rem] text-md rounded-[2rem]"
              >
                Join now
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className={`md:hidden flex fixed items-center h-16 border-t border-gray-300 w-full bg-dark-primary ${
          isVisible ? "fixed" : "hidden"
        }  bottom-0`}
      >
        <Link to={"/"} className={mobileLinkBaseClass}>
          <Home size={28} />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/network" className={mobileLinkBaseClass}>
          <Users size={28} />
          <span className="text-xs">My Network</span>
          {unreadConnectionRequestsCount > 0 && (
            <span className={notificationSpanClass}>
              {unreadConnectionRequestsCount}
            </span>
          )}
        </Link>
        <Link to="/notifications" className={mobileLinkBaseClass}>
          <Bell size={28} />
          <span className="text-xs ">Notifications</span>
          {unreadNotificationCount > 0 && (
            <span className={notificationSpanClass}>
              {unreadNotificationCount}
            </span>
          )}
        </Link>
        <Link
          to={`/profile/${authUser?.username}`}
          className={mobileLinkBaseClass}
        >
          <User size={28} />
          <span className="text-xs ">Me</span>
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;
