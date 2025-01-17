import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Video, X, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create post", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    },
  });

  const handlePostCreation = async () => {
    if (!content.trim() && !media) {
      toast.error("Please add some content or media", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    try {
      const postData = { 
        content, 
        media: media ? media : null, 
        mediaType: mediaType 
      };

      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setMedia(null);
    setMediaType(null);
    setMediaPreview(null);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const fileType = file.type.split('/')[0];

      reader.onloadend = () => {
        setMedia(reader.result);
        setMediaType(fileType);
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaType(null);
    setMediaPreview(null);
  };

  return (
    <div className="bg-dark-primary rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg border border-info bg-transparent focus:bg-dark-primary focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {mediaPreview && (
        <div className="mt-4 relative">
          {mediaType === 'image' ? (
            <img 
              src={mediaPreview} 
              alt="Selected" 
              className="w-full h-auto rounded-lg" 
            />
          ) : (
            <video 
              src={mediaPreview} 
              controls 
              className="w-full rounded-lg"
            />
          )}
          <button 
            onClick={removeMedia}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaChange}
            />
          </label>
        </div>

        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;