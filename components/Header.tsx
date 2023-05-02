import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    if (onLogout) {
      onLogout();
    }
    router.push('/');
  };

  const handleSwitchWorkspace = async () => {
    // Fetch available workspaces (organizations) here
    const response = await fetch('/api/trello/organizations');
    const data = await response.json();

    if (response.ok) {
      console.log('Workspaces:', data.result);
      setWorkspaces(data.result); // Store the fetched workspaces in the state
    } else {
      console.error('Error fetching workspaces:', data.message);
    }
  };

  const selectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    console.log('Selected workspace:', workspace);
    // Perform any additional actions needed when selecting a workspace
  };


  return (
    <header className="flex justify-between items-center py-4 px-8">
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
        <button onClick={() => setShowDropdown(!showDropdown)} className="bg-gray-200 text-black px-3 py-1 rounded-lg font-semibold text-lg focus:outline-none hover:bg-opacity-80 transition-opacity">
          Settings
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button onClick={handleSwitchWorkspace} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Fetch Workspaces
            </button>
            {workspaces.map((workspace, index) => (
              <button key={index} onClick={() => selectWorkspace(workspace)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                {workspace.name}
              </button>
            ))}
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
