import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getGroups, createGroup } from "../../lib/chat";
import ChatTab from "../../components/Chat/ChatTab";
import LoadingScreen from "../../components/LoadingScreen";
import { useAuth } from '../../contexts/AuthContext';
import TodoTab from "../../components/Todo/TodoTab";

function NavBar({groupName, activeTab, setActiveTab, showMember, setShowMember}) {
  return (
    <div className="flex justify-between items-center text-[24px] font-bold h-16 px-[17px] py-[10px] border-b-[3px] border-[rgba(0,0,0,0.25)]">
        {groupName}
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

          <button>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={showMember? "#08BD7A" : "#ffffff"} className="size-6">
              <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
          </button>
        </div>
      </div>
  )
}

function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const activeTab = searchParams.get("tab") || "chat"
  const showMember = searchParams.get("member") === "true" || false
  const [newGroupName, setNewGroupName] = useState("");

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
      }
    };

    fetchGroups();
  }, [user]);

  useEffect(() => {
    console.log(activeTab)
  }, [activeTab]);

  const renderView = () => {
    switch (activeTab) {
      case "chat":
        if (selectedGroup)
          return <ChatTab groupId={selectedGroup?.id} />;
        else 
          return <h1>Select a group</h1>;
      
      case "file":
        return "file"

      case "todo":
        return <TodoTab />

      default:
        return "chat"
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen text-[16px] text-text">
      <div className="basis-1/4 bg-shade-500 flex flex-col">
        <div className="flex items-center text-[24px] font-bold h-16 px-[23px] py-[9px] border-b-[3px] border-[rgba(0,0,0,0.25)]">
          Chats
        </div>
        <div className="overflow-y-auto flex-grow">
          {groups.map(group => (
            <div 
              key={group.id}
              className={`p-4 cursor-pointer hover:bg-shade-400 ${selectedGroup?.id === group.id ? 'bg-shade-400' : ''}`}
              onClick={() => setSelectedGroup(group)}
            >
              {group.name}
            </div>
          ))}
        </div>
        <form onSubmit={handleCreateGroup} className="p-4 border-t-2 border-shade-400">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="New group name"
            className="w-full px-3 py-2 bg-shade-300 rounded-md"
          />
        </form>
      </div>
      <div className="basis-3/4 bg-shade-400">
        <NavBar 
          groupName={selectedGroup ? selectedGroup.name : "Select a group"} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          showMember={showMember} 
          setShowMember={setShowMember} 
        />
        <div className="flex flex-row h-[671px]">
          {renderView()}
          {showMember &&
            <div className="basis-1/3 bg-shade-500">
              Hello
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default MainPage;
