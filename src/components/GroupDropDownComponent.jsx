import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userSignOut } from "../lib/action";

function GroupDropDownComponent({children}) {
    const [isParentOpen, setIsParentOpen] = useState(false);
    const [isChildOpen, setIsChildOpen] = useState(false);
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
        console.log(dropdownRef)
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
              {/* Child Dropdown Menu */}
              {isChildOpen && (
                <div className="absolute left-full top-0 ml-2 w-[300px] p-4  z-10 bg-shade-300 rounded-md shadow-lg">
                  <div className="">Create New Group</div>
                  {children}
                </div>
              )}
            <li className="px-4 py-2 hover:bg-shade-200 cursor-pointer" onClick={() => navigate("/profile")}>
              Profile

            </li>
            <li className="px-4 py-2 hover:bg-shade-200 cursor-pointer" onClick={handleSignOut}>
              Log Out
            </li>
          </ul>
        </div>
      )}
        </div>
    )
}

export default GroupDropDownComponent
