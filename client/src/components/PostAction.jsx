export default function PostAction({ icon, text, onClick, active }) {
  return (
    <button 
      className="flex items-center group hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200" 
      onClick={onClick}
    >
      <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </span>
      <span className="text-gray-300 font-semibold group-hover:text-gray-200">
        {text}
      </span>
    </button>
  );
}