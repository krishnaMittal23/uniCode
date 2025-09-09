import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('ROOM ID & username is required');
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: { username },  // to pass data from one route to another
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.svg"
            alt="code-sync-logo"
            className="h-16"
          />
        </div>

        <h4 className="text-lg font-semibold text-center mb-4">
          Paste invitation <span className="text-indigo-400">ROOM ID</span>
        </h4>

        <div className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="USERNAME"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium transition"
            onClick={joinRoom}
          >
            Join
          </button>
          <p className="text-sm text-gray-400 text-center">
            If you don&apos;t have an invite then create{' '}
            <a
              onClick={createNewRoom}
              href=""
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              new room
            </a>
          </p>
        </div>
      </div>

      <footer className="mt-6 text-gray-500 text-sm">
        Built with 💛 by{' '}
        <a
          href="https://github.com/krishnaMittal23"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Krishna Mittal
        </a>
      </footer>
    </div>
  );
};

export default Home;
