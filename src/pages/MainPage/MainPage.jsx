import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getGroups, createGroup, getGroupMembers, addGroupMember, getLastMessage, updateGroup, leaveGroup } from "../../lib/chat";
import ChatTab from "../../components/Chat/ChatTab";
import LoadingScreen from "../../components/LoadingScreen";
import { useAuth } from '../../contexts/AuthContext';
import TodoTab from "../../components/Todo/TodoTab";
import FileTab from "../../components/FileTab";
import { useProfiles } from '../../contexts/ProfileContext';
import GroupDropDownComponent from "../../components/GroupDropDownComponent";
import { getProfileInfo, updateProfilePicture } from "../../lib/action";

function ProfileModal({ onClose }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const fileInputRef = useRef(null);

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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-shade-300 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary hover:bg-primary/80 text-white p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
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

function NavBar({ groupName, activeTab, setActiveTab, showMember, setShowMember, onVideoCall }) {
  return (
    <div className="flex justify-between items-center text-[24px] font-bold h-16 px-[17px] py-[10px] border-b-[3px] border-[rgba(0,0,0,0.25)]">
      <div className="truncate max-w-[50%]">{groupName}</div>
      <div className="flex gap-4">
        <button onClick={() => setActiveTab("chat")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={activeTab == "chat" ? "#08BD7A" : "#ffffff"} className="size-6">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
          </svg>
        </button>

        <button onClick={() => setActiveTab("file")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={activeTab == "file" ? "#08BD7A" : "#ffffff"} className="size-6">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
          </svg>
        </button>

        <button onClick={onVideoCall}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clipRule="evenodd" />
          </svg>
        </button>

        <button onClick={() => setActiveTab("todo")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={activeTab == "todo" ? "#08BD7A" : "#ffffff"} className="size-6">
            <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15Z" clipRule="evenodd" />
          </svg>
        </button>

        <button onClick={() => setShowMember("member")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={showMember ? "#08BD7A" : "#ffffff"} className="size-6">
            <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}


function MemberList({ groupId }) {
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const { user } = useAuth();
  const { getProfile } = useProfiles();

  useEffect(() => {
    const fetchMembers = async () => {
      if (!groupId || !user) return;
      const idToken = await user.getIdToken();
      const result = await getGroupMembers(groupId, idToken);
      if (result.success) {
        const membersWithProfiles = await Promise.all(
          result.members.map(async (member) => {
            const profile = await getProfile(member.uid, idToken);
            return {
              ...member,
              displayName: profile ? profile.username : member.email
            };
          })
        );
        setMembers(membersWithProfiles);
      }
    };
    fetchMembers();
  }, [groupId, user, getProfile]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !user || !groupId) return;

    const idToken = await user.getIdToken();
    const result = await addGroupMember(groupId, newMemberEmail, idToken);

    if (result.success) {
      setNewMemberEmail("");
      // Refresh member list
      const updatedMembers = await getGroupMembers(groupId, idToken);
      if (updatedMembers.success) {
        setMembers(updatedMembers.members);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Members</h2>
      <div className="space-y-2 mb-4">
        {members.map(member => (
          <div key={member.uid} className="flex items-center justify-between">
            <span>{member.displayName}</span>
            {member.isAdmin && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#08BD7A" className="size-6">
                <path d="M576 136c0 22.09-17.91 40-40 40c-.248 0-.4551-.1266-.7031-.1305l-50.52 277.9C482 468.9 468.8 480 453.3 480H122.7c-15.46 0-28.72-11.06-31.48-26.27L40.71 175.9C40.46 175.9 40.25 176 39.1 176c-22.09 0-40-17.91-40-40S17.91 96 39.1 96s40 17.91 40 40c0 8.998-3.521 16.89-8.537 23.57l89.63 71.7c15.91 12.73 39.5 7.544 48.61-10.68l57.6-115.2C255.1 98.34 247.1 86.34 247.1 72C247.1 49.91 265.9 32 288 32s39.1 17.91 39.1 40c0 14.34-7.963 26.34-19.3 33.4l57.6 115.2c9.111 18.22 32.71 23.4 48.61 10.68l89.63-71.7C499.5 152.9 496 144.1 496 136C496 113.9 513.9 96 536 96S576 113.9 576 136z" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleAddMember}>
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="Add member by email"
          className="w-full px-3 py-2 bg-shade-300 border-0 focus:ring-0 placeholder:italic placeholder:text-text rounded-md"
        />
      </form>
    </div>
  );
}

function EditGroupModal({ group, onClose, onUpdate }) {
  const [name, setName] = useState(group.name);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(group.profileUrl);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const idToken = await user.getIdToken();
    const nameChanged = name !== group.name;

    if (nameChanged || file) {
      const result = await updateGroup(group.id, idToken, nameChanged ? name : undefined, file);
      if (result.success) {
        onUpdate();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-shade-300 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-shade-400 rounded border-0 focus:ring-0"
            />
          </div>
          <div>
            <label className="block mb-2">Group Picture</label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-shade-400 flex items-center justify-center">
                  <span className="text-2xl">{name[0]}</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded hover:bg-shade-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Invalid";

  try {
      let date;
      if (timestamp._seconds && timestamp._nanoseconds) {
          date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
      } else if (typeof timestamp === 'string' || timestamp instanceof Date) {
          date = new Date(timestamp);
      } else {
          return "Invalid";
      }

      if (isNaN(date.valueOf())) {
          return "Invalid";
      }

      return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
      }).format(date);
  } catch (error) {
      console.error('Error formatting timestamp:', error);
      return "Invalid";
  }
};

function GroupContextMenu({ group, position, onClose, onUpdate, user }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const isAdmin = group.admins?.includes(user?.uid);

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) {
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const data = await leaveGroup(group.id, idToken);
      if (data.success) {
        onUpdate();
        onClose();
      } else {
        alert('Failed to leave group');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div 
        className="fixed z-50 bg-shade-300 rounded-lg shadow-lg p-4 min-w-[200px]"
        style={{ top: position.y, left: position.x }}
      >
        <div className="flex items-center gap-3 mb-4">
          {group.profileUrl ? (
            <img src={group.profileUrl} alt={group.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-shade-400 flex items-center justify-center">
              <span className="text-lg font-bold">{group.name[0]}</span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{group.name}</h3>
            <p className="text-sm text-gray-400">
              Created {formatTimestamp(group.createdAt)}
              {isAdmin && <span className="ml-2 text-primary">(Admin)</span>}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-600 pt-2">
          {isAdmin && (
            <button 
              className="w-full text-left py-2 px-4 hover:bg-shade-400 rounded"
              onClick={() => setShowEditModal(true)}
            >
              Edit Group
            </button>
          )}
          <button 
            className="w-full text-left py-2 px-4 hover:bg-shade-400 rounded text-red-500"
            onClick={handleLeaveGroup}
          >
            Leave Group
          </button>
        </div>
      </div>
      {showEditModal && isAdmin && (
        <EditGroupModal
          group={group}
          onClose={() => {
            setShowEditModal(false);
            onClose();
          }}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const activeTab = searchParams.get("tab") || "chat"
  const showMember = searchParams.get("member") === "true" || false
  const groupId = searchParams.get("group")
  const [newGroupName, setNewGroupName] = useState("");
  const [lastMessages, setLastMessages] = useState({});
  const [contextMenu, setContextMenu] = useState({ position: null, group: null });

  const setActiveTab = (tab) => {
    searchParams.set("tab", tab)
    setSearchParams(searchParams)
  }

  const setShowMember = () => {
    showMember ? searchParams.set("member", false) : searchParams.set("member", true)
    setSearchParams(searchParams)
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim() || !user) return;

    const idToken = await user.getIdToken();
    const result = await createGroup(newGroupName, idToken);

    if (result.success) {
      setNewGroupName("");
      // Refresh groups list
      const updatedGroups = await getGroups(idToken);
      if (updatedGroups.success) {
        setGroups(updatedGroups.groups);
      }
    }
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    searchParams.set("group", group.id);
    setSearchParams(searchParams);
  };

  const handleVideoCall = () => {
    if (selectedGroup) {
      window.open(`/video-call/${selectedGroup.id}`, '_blank');
    }
    else {
      window.open(`/video-call/`, '_blank');
    }
  };

  const handleContextMenu = (e, group) => {
    e.preventDefault();
    setContextMenu({
      position: {
        x: e.clientX,
        y: e.clientY,
      },
      group
    });
  };

  const handleUpdateGroup = async () => {
    if (!user) return;
    const idToken = await user.getIdToken();
    const result = await getGroups(idToken);
    if (result.success) {
      setGroups(result.groups);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;

      const idToken = await user.getIdToken();
      const result = await getGroups(idToken);
      if (result.success) {
        setGroups(result.groups);
        if (groupId) {
          const group = result.groups.find(g => g.id === groupId);
          if (group) {
            setSelectedGroup(group);
          }
        }
      }
    };

    fetchGroups();
  }, [user, groupId]);

  useEffect(() => {
    const updateLastMessages = async () => {
      if (!user || !groups.length) return;
      
      const idToken = await user.getIdToken();
      
      // Update last message for each group
      const messages = await Promise.all(
        groups.map(async (group) => {
          const result = await getLastMessage(group.id, idToken);
          return [group.id, result.lastMessage];
        })
      );

      setLastMessages(Object.fromEntries(messages));
    };

    updateLastMessages();
    
    // Set up interval to check for new messages
    const interval = setInterval(updateLastMessages, 100000);
    return () => clearInterval(interval);
  }, [groups, user]);

  useEffect(() => {
    console.log(activeTab)
  }, [activeTab]);

  const renderView = () => {
    if (selectedGroup) {
      switch (activeTab) {
        case "chat":
          return <ChatTab groupId={selectedGroup?.id} />;

        case "file":
          return <FileTab groupId={selectedGroup?.id} />;

        case "todo":
          return <TodoTab groupId={selectedGroup?.id} />;

        default:
          return "chat"
      }
    } else {
      return (
        <div className="flex flex-col items-center justify-center w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#44C588" className="size-[128px]">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
          </svg>

          <div className="text-[24px]">It looks empty... Please select or create new group to get started.</div>
        </div>

      ) 
    }
  }

    if (loading) {
      return <LoadingScreen />;
    }

    return (
      <div className="flex h-screen text-[16px] text-text">
        <div className="basis-1/4 bg-shade-500 flex flex-col">
          <div className="flex justify-between items-center h-16 px-6 py-[9px] border-b-[3px] border-[rgba(0,0,0,0.25)]">
            <div className="text-[24px] font-bold ">Groups</div>
            <GroupDropDownComponent>
              <form onSubmit={handleCreateGroup} className="">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="New group name"
                  className="w-full px-3 py-2 mt-2 bg-shade-400 border-0 focus:ring-0 placeholder:italic placeholder:text-text rounded-md"
                />
              </form>
            </GroupDropDownComponent>
          </div>
          <div className="overflow-y-auto flex-grow">
            {groups.map(group => (
              <div
                key={group.id}
                className={`p-4 cursor-pointer hover:bg-shade-400 ${selectedGroup?.id === group.id ? 'bg-shade-400' : ''}`}
                onClick={() => handleGroupSelect(group)}
                onContextMenu={(e) => handleContextMenu(e, group)}
              >
                <div className="flex items-center gap-3">
                  {group.profileUrl ? (
                    <img src={group.profileUrl} alt={group.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-shade-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold">{group.name[0]}</span>
                    </div>
                  )}
                  <div className="flex-grow min-w-0"> 
                    <div className="font-bold truncate">{group.name}</div>
                    {lastMessages[group.id] && (
                      <div className="text-sm text-gray-400 truncate flex gap-1">
                        <span className="font-medium truncate max-w-[80px]">{lastMessages[group.id].sender}:</span>
                        {lastMessages[group.id].isFile ? (
                          <div className="flex items-center gap-1 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                            </svg>
                            <span className="truncate">{lastMessages[group.id].fileName}</span>
                          </div>
                        ) : (
                          <span className="truncate">{lastMessages[group.id].text}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {lastMessages[group.id] && (
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(lastMessages[group.id].timestamp.seconds * 1000).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {contextMenu.position && (
              <GroupContextMenu
                group={contextMenu.group}
                position={contextMenu.position}
                onClose={() => setContextMenu({ position: null, group: null })}
                onUpdate={handleUpdateGroup}
                user={user}
              />
            )}
          </div>
        </div>
        <div className="basis-3/4 bg-shade-400">
          <NavBar
            groupName={selectedGroup ? selectedGroup.name : "Main Page"}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showMember={showMember}
            setShowMember={setShowMember}
            onVideoCall={handleVideoCall}
          />
          <div className="flex flex-row h-[calc(100%-4rem)]">
            {renderView()}
            {showMember && selectedGroup &&
              <div className="basis-1/3 bg-shade-500">
                <MemberList groupId={selectedGroup.id} />
              </div>
            }
          </div>
        </div>
      </div>
    )
  }

  export default MainPage;
