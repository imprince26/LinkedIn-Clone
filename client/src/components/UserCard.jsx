/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
  return (
    <div className="bg-transparent rounded-lg border border-gray-600 shadow p-4 flex flex-col items-center transition-all hover:shadow-md">
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="md:w-16 md:h-16 w-12 h-12 rounded-full object-cover mb-4"
        />
        <h3 className="font-semibold md:text-lg text-sm  text-center">{user.name}</h3>
      </Link>
      <p className="text-gray-200 md:text-sm text-xs text-center">{`${user.headline.slice(0,25)}..`}</p>
      <p className="text-sm text-gray-300 mt-2">
        {user.connections?.length} connections
      </p>
      <button className="mt-4 bg-primary text-sm md:text-lg text-white md:px-4 md:py-2 px-2 py-[.2rem] rounded-md hover:bg-primary-dark transition-colors w-full">
        {isConnection ? "Connected" : "Connect"}
      </button>
    </div>
  );
}

export default UserCard;
