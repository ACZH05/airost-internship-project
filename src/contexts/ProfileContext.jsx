import { createContext, useContext, useState } from 'react';
import { getUserProfile } from '../lib/todos';

const ProfileContext = createContext();

export function useProfiles() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState({});

  const getProfile = async (userId, idToken) => {
    if (profiles[userId]) {
      return profiles[userId];
    }

    const result = await getUserProfile(userId, idToken);
    if (result.success) {
      const profile = {
        username: `${result.profile.firstName} ${result.profile.lastName}`,
        profilePicture: result.profile.profilePictureUrl || 'https://utfs.io/f/n1CDOLNQtUGkbe4jZjaeEsrGvpiUFQC7x2mYJ0jR4DMktw1d'
      };
      setProfiles(prev => ({ ...prev, [userId]: profile }));
      return profile;
    }
    return null;
  };

  return (
    <ProfileContext.Provider value={{ getProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}