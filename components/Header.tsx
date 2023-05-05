import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

interface HeaderProps {
  handleLogout: () => void;
  setOrganizationId: (organizationId: string) => void;
}

export default function Header({
  handleLogout,
  setOrganizationId,
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const router = useRouter();
  const hideDropdownTimeout = useRef<number | null>(null);
  const handleSwitchWorkspace = async () => {
    // Fetch available workspaces (organizations) here
    const response = await fetch("/api/trello/organizations");
    const data = await response.json();

    if (response.ok) {
      setWorkspaces(data.result); // Store the fetched workspaces in the state
    } else {
      console.error("Error fetching workspaces:", data.message);
    }
  };

  const selectWorkspace = (workspace: { name: string; id: string }) => {
    setSelectedWorkspace(workspace);
    setOrganizationId(workspace.id); // Fetch boards for the selected workspace

    // Perform any additional actions needed when selecting a workspace
  };

  const fetchUserBoards = async () => {
    const response = await fetch("/api/trello/boards");
    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching user boards:", data.message);
    }
  };

  const handleMouseEnter = () => {
    if (hideDropdownTimeout.current !== null) {
      window.clearTimeout(hideDropdownTimeout.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    hideDropdownTimeout.current = window.setTimeout(
      () => setShowDropdown(false),
      200
    );
  };

  return (
    <header className="flex w-full justify-between items-center py-4 px-8">
      <div className="flex justify-start">
        <Link href="/" passHref>
          <div className="flex space-x-3 cursor-pointer">
            <Image
              alt="header text"
              src="/writingIcon.png"
              className="sm:w-12 sm:h-12 w-8 h-8"
              width={32}
              height={32}
            />
            <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
              ProductGPT
            </h1>
          </div>
        </Link>
      </div>
      <div className="relative ml-auto">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          onMouseEnter={handleMouseEnter}
          className="bg-gray-200 text-black px-3 py-1 rounded-lg font-semibold text-lg focus:outline-none hover:bg-opacity-80 transition-opacity"
        >
          Settings
        </button>
        {showDropdown && (
          <div onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={handleSwitchWorkspace}
              
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Filter Workspaces
            </button>
            {workspaces.map(
              (workspace: { name: string; id: string }, index) => (
                <button
                  key={"indexTrelloWorkspace" + index}
                  onClick={() => workspace && selectWorkspace(workspace)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {workspace.name}
                </button>
              )
            )}
            <button
              onClick={fetchUserBoards}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Show All Boards
            </button>
            <hr className="border-t border-gray-300" />
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
