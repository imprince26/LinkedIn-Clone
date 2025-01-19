/* eslint-disable react/prop-types */
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  size = 48,
  color = "text-primary",
  message = "Loading...",
  fullScreen = false,
}) => {
  const spinnerClasses = `
    ${
      fullScreen
        ? "fixed inset-0 z-50 flex items-center justify-center bg-black"
        : ""
    }
    flex flex-col items-center justify-center
  `;

  const iconClasses = `
    animate-spin 
    ${color}
  `;

  return (
    <div className={spinnerClasses}>
      <Loader2 size={size} className={iconClasses} strokeWidth={2.5} />
      {message && (
        <p className="text-gray-300 mt-4 text-lg font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
