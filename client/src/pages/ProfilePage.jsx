import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import RecommendedUser from "../components/RecommendedUser";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`),
  });
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully",{
        style : {
          background : "#333",
          color : "#fff",
        }
      });
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  if (isLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser.username === userProfile.data.username;
  const userData = isOwnProfile ? authUser : userProfile.data;

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className="lg:max-w-[90vw] grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto p-2">
      <div className="lg:col-span-2">
        <ProfileHeader
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <AboutSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <ExperienceSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <EducationSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <SkillsSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
      </div>
      <div className="lg:col-span-1">
        {recommendedUsers?.length > 0 && (
          <div className="bg-dark-primary rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg mb-4">People you may know</h2>
            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
