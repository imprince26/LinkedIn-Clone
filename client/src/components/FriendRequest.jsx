import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
  const queryClient = useQueryClient();

  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error.response.data.error, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  const { mutate: rejectConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  return (
    <div className="bg-transparent rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePicture || "/avatar.png"}
            alt={request.name}
            className="md:w-16 md:h-16 w-12 h-12 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-[1rem] md:text-lg"
          >
            {request.sender.name}
          </Link>
          <p className="text-gray-400 hidden md:block">
            {request.sender.headline}
          </p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className="bg-primary text-[.8rem] md:text-lg text-white md:px-4 md:py-2 px-2 py-1 rounded-md hover:brightness-90 transition-colors"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          Accept
        </button>
        <button
          className="bg-gray-200 text-[.8rem] md:text-lg text-gray-800 md:px-4 md:py-2 px-2 py-1 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => rejectConnectionRequest(request._id)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
export default FriendRequest;
