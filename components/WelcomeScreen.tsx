import React, { useState, useEffect } from 'react';

const WelcomeScreen: React.FC<{ setShowWelcome: (show: boolean) => void }> = ({ setShowWelcome }) => {
  const [showModal, setShowModal] = useState(false);
  const [boards, setBoards] = useState([]);

  const handleClose = () => {
    setShowWelcome(false);
    window.location.href = 'https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&key=2763e28ba1be71c85d97cf5206872560&return_url=http://localhost:3000';
  };

  const handleCloseButton = () => {
    setShowWelcome(false);
  };

  const handleOpenModal = async () => {
    // Define accessToken here
    const accessToken = localStorage.getItem('trello_access_token');
  
    if (!accessToken) {
      console.error('Access token not found');
      handleClose(); // Redirect the user to the Trello authorization page
      return;
    }
  
    setShowModal(true);
  
    const response = await fetch(`https://api.trello.com/1/members/me/boards?key=${process.env.NEXT_PUBLIC_TRELLO_API_KEY}&token=${accessToken}`);
    const data = await response.json();
    setBoards(data);
  };

  
  const fetchBoardData = async (boardId: string) => {
    try {
      const response = await fetch(`/api/trello/board/${boardId}`);
      const data = await response.json();

      if (response.ok) {
        console.log('Board data:', data);
        // Process the fetched board data here
      } else {
        console.error('Error fetching board data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const handleBoardSelect = (id: string) => {
    fetchBoardData(id);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
        <button onClick={handleCloseButton} className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-lg font-semibold text-lg focus:outline-none hover:bg-opacity-80 transition-opacity">
          X
        </button>
        <h1 className="text-6xl font-bold text-white mb-8">Welcome to Trello Chat Query</h1>
        <p className="text-xl text-white mb-8">Ask questions and get instant answers about your Trello boards</p>
        <button onClick={handleOpenModal} className="bg-white text-black px-6 py-3 rounded-lg font-semibold text-lg focus:outline-none hover:bg-opacity-80 transition-opacity">
        Get Started
      </button>
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Select a Board</h2>
            <ul>
              {boards.map((board: any) => (
                <li key={board.id} className="mb-2">
                  <button onClick={() => handleBoardSelect(board.id)} className="text-blue-600 hover:text-blue-800">
                    {board.name}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </div> // Add the missing closing tag here
  );
};

export default WelcomeScreen;
