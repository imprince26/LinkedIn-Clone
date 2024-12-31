import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

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
    },
  });

  const unreadNotificationCount = notifications?.data.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  return (
    <nav
      className="h-[8vh] bg-dark-primary shadow-md sticky top-0 z-10"
    >
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
                  className="text-neutral flex flex-col items-center opacity-80 hover:opacity-100 hover:brightness-200 relative "
                >
                  <Home size={24} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center  opacity-80 hover:opacity-100 hover:brightness-200 relative"
                >
                  <Users size={24} />
                  <span className="text-xs hidden md:block">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-red-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="text-neutral flex flex-col items-center  opacity-80 hover:opacity-100 hover:brightness-200 relative"
                >
                  <Bell size={24} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-red-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center  opacity-80 hover:opacity-100 hover:brightness-200 relative"
                >
                  <User size={24} />
                  <span className="text-xs hidden md:block">Me</span>
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
    </nav>
  );
};
export default Navbar;
