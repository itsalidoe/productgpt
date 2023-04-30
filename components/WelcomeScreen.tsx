import React from 'react';

const WelcomeScreen: React.FC<{ setShowWelcome: (show: boolean) => void }> = ({ setShowWelcome }) => {
  const handleClose = () => {
    setShowWelcome(false);
    window.location.href = 'https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&key=4001343302f0450d29e3da0388ddc711';
  };

  const handleCloseButton = () => {
    setShowWelcome(false);
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
        <button onClick={handleClose} className="bg-white text-black px-6 py-3 rounded-lg font-semibold text-lg focus:outline-none hover:bg-opacity-80 transition-opacity">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
