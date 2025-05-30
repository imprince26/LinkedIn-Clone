import {
    FaFacebook as Facebook,
    FaWhatsapp as WhatsApp,
    FaLink as Link2,
} from "react-icons/fa";
import { FaXTwitter as XTwitter } from "react-icons/fa6";
import { X } from 'lucide-react';
import toast from "react-hot-toast";

const ShareModal = ({ isOpen, onClose, postId }) => {
    if (!isOpen) return null;

    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/post/${postId}`;

    const shareOptions = [
        {
            name: "Copy Link",
            icon: <Link2 className="size-5" />,
            action: () => {
                navigator.clipboard.writeText(postUrl);
                toast.success("Link copied to clipboard!", {
                    style: {
                        background: "#333",
                        color: "#fff",
                    },
                });
                onClose();
            },
            className: "bg-gray-600 hover:bg-gray-700",
        },
        {
            name: "WhatsApp",
            icon: <WhatsApp className="size-5" />,
            action: () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`);
                onClose();
            },
            className: "bg-green-600 hover:bg-green-700",
        },
        {
            name: "Facebook",
            icon: <Facebook className="size-5" />,
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`);
                onClose();
            },
            className: "bg-blue-600 hover:bg-blue-700",
        },
        {
            name: "X (Twitter)",
            icon: <XTwitter className="size-5" />,
            action: () => {
                window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(postUrl)}`);
                onClose();
            },
            className: "bg-black hover:bg-gray-900",
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-dark-primary rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-200">Share Post</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-300"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {shareOptions.map((option) => (
                        <button
                            key={option.name}
                            onClick={option.action}
                            className={`${option.className} text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200`}
                        >
                            {option.icon}
                            <span>{option.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;