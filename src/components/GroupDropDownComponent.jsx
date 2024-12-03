import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignOut, getProfileInfo, updateProfilePicture } from "../lib/action";
import { useAuth } from '../contexts/AuthContext';

function ProfileModal({ onClose }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const idToken = await user.getIdToken();
        const result = await getProfileInfo(idToken);
        if (result.success) {
          setProfile(result.profile);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const idToken = await user.getIdToken();
      const result = await updateProfilePicture(idToken, file);
      
      if (result.success) {
        setProfile(prev => ({
          ...prev,
          profilePictureUrl: result.profilePictureUrl 
        }));
      } else {
        alert(result.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-shade-300 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-shade-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {profile ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={profile.profilePictureUrl || "https://utfs.io/f/n1CDOLNQtUGkbe4jZjaeEsrGvpiUFQC7x2mYJ0jR4DMktw1d"}
                  alt="Profile"
                  className={`w-32 h-32 rounded-full object-cover ${isUploading ? 'opacity-50' : ''}`}
                />
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-shade-200 absolute bottom-0 right-0 bg-primary hover:bg-primary/80 text-white p-2 rounded-full"
                    disabled={isUploading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePictureUpload}
                />
              </div>
            </div>
            <div>
              <p className="text-gray-400">Name</p>
              <p className="font-medium">{profile.firstName} {profile.lastName}</p>
            </div>
            <div>
              <p className="text-gray-400">Phone</p>
              <p className="font-medium">{profile.areaCode} {profile.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">Loading profile...</div>
        )}
      </div>
    </div>
  );
}

function GroupDropDownComponent({ children }) {
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isChildOpen, setIsChildOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await userSignOut();
    navigate('/login');
  };

  // Toggle parent dropdown
  const toggleParentMenu = () => {
    setIsParentOpen(!isParentOpen);
    setIsChildOpen(false); // Close child menu when parent toggles
  };

  // Toggle child dropdown
  const toggleChildMenu = () => {
    setIsChildOpen(!isChildOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsParentOpen(false);
        setIsChildOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div ref={dropdownRef} className="relative inline-block" >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 p-1 hover:bg-[rgba(255,2555,255,0.1)] rounded-[20px] cursor-pointer" onClick={toggleParentMenu}>
        <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
      </svg>
      {isParentOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-shade-300 rounded-md shadow-lg">
          <ul className="py-1">
            <li className="flex justify-between items-baseline relative px-4 py-2 hover:bg-shade-200 cursor-pointer" onClick={toggleChildMenu}>
              New Group
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </li>
            {isChildOpen && (
              <div className="absolute left-full top-0 ml-2 w-[300px] p-4  z-10 bg-shade-300 rounded-md shadow-lg">
                <div className="">Create New Group</div>
                {children}
              </div>
            )}
            <li 
              className="px-4 py-2 hover:bg-shade-200 cursor-pointer" 
              onClick={() => {
                setShowProfileModal(true);
                setIsParentOpen(false);
              }}
            >
              Profile
            </li>
            <li className="px-4 py-2 hover:bg-shade-200 cursor-pointer" onClick={handleSignOut}>
              <span className="text-red-500">Log Out</span>
            </li>
          </ul>
        </div>
      )}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  )
}

export default GroupDropDownComponent;
