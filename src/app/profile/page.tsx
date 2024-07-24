"use client";
import { useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface UserProfile {
  age: number | null;
  height: number | null;
  weight: number | null;
  goal: string | null;
  updatedAt: string | null;
}

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/getProfile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !isSignedIn) {
      console.error("User not authenticated");
      alert("User not authenticated. Please log in and try again.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      age: formData.get('age') ? Number(formData.get('age')) : null,
      height: formData.get('height') ? Number(formData.get('height')) : null,
      weight: formData.get('weight') ? Number(formData.get('weight')) : null,
      goal: formData.get('goal') as string | null,
    };

    try {
      const token = await getToken();
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
          ...updatedProfile,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setProfile(data);
      alert("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred while updating your profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto mt-8 pt-8 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      {profile && (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Current Profile</h2>
          <p>Age: {profile.age}</p>
          <p>Height: {profile.height} inches</p>
          <p>Weight: {profile.weight} lbs</p>
          <p>Goal: {profile.goal}</p>
          <p className="mt-4 text-sm text-gray-400">Last Updated: {new Date(profile.updatedAt || '').toLocaleString()}</p>
        </div>
      )}
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{profile ? 'Update Profile' : 'Create Profile'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium mb-2">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={profile?.age || ""}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="height" className="block text-sm font-medium mb-2">
              Height (in inches):
            </label>
            <input
              type="number"
              id="height"
              name="height"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={profile?.height || ""}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="weight" className="block text-sm font-medium mb-2">
              Weight (in lbs):
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={profile?.weight || ""}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="goal" className="block text-sm font-medium mb-2">
              Goal:
            </label>
            <input
              type="text"
              id="goal"
              name="goal"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={profile?.goal || ""}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}