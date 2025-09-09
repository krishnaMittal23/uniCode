import React, { useEffect, useRef, useState } from 'react';
import Editor from '../_components/Editor';
import Client from '../_components/CLient';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast'

const EditorPage = () => {

  const {roomId} = useParams();

  const reactNavigator= useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();

  const [clients, setClients] = useState([]);

  useEffect(()=>{

    const init = async()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));



      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }


      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username: location.state?.username,
      });


      // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                     socketRef.current.emit(ACTIONS.SYNC_CODE, {
                         code: codeRef.current,
                         socketId,
                     });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );

    }

    init();

    // cleaning function (returning function in react)
    return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
    };


  },[]);


  async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

  


  if (!location.state) {
        return <Navigate to="/" />;
    }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col p-4 border-r border-gray-700">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="logo" className="h-10" />
        </div>

        <h3 className="text-sm font-semibold text-gray-400 mb-2">Connected</h3>

        {/* Clients List */}
        <div className="flex flex-col gap-3 mb-6 overflow-y-auto flex-1">
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={copyRoomId} className="w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg font-medium transition">
            Copy ROOM ID
          </button>
          <button onClick={leaveRoom} className="w-full cursor-pointer bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition">
            Leave
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 p-4">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=> {codeRef.current = code}}/>
      </div>
    </div>
  );
};

export default EditorPage;
