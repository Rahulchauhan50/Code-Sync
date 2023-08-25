import React, { useState, useRef, useEffect } from 'react'
import Client from '../component/Client';
import Editor from '../component/Editor';
import { BiSolidCopy, BiExit } from "react-icons/bi";
import { initSocket } from '../socket';
import ACTIONS from './Actions';
import { Navigate, useLocation, useParams, useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditorPage() {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null)
  const codeRef = useRef(null);
  const location = useLocation();
  const {RoomId} = useParams();
  const reactNavigator = useNavigate();

  const init = async() => {
    socketRef.current = await initSocket();
    socketRef.current.on('connect_error', (err) => handleErrors(err));
    socketRef.current.on('connect_failed', (err) => handleErrors(err));

    function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
    }

    socketRef.current.emit(ACTIONS.JOIN, {
      roomId:RoomId,
      username: location.state?.username
    })

    socketRef.current.on(
      ACTIONS.JOINED,
      ({ clients, username, socketId }) => {
          if (username !== location.state.username) {
              toast.success(`${username} joined the room.`);
              console.log(`${username} joined`);
          }
          console.log(clients)
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
          });
      }
  );

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
  useEffect(()=>{
    console.log("you")
    init();

    return () => {
            socketRef.current?.disconnect();
            socketRef.current?.off(ACTIONS.JOINED);
            socketRef.current?.off(ACTIONS.DISCONNECTED);
        };
  },[])

  async function copyRoomId() {
    try {
        await navigator.clipboard.writeText(RoomId);
        toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
        toast.error('Could not copy the Room ID');
        console.error(err);
    }
}

function leaveRoom() {
  reactNavigator('/');
}


  if(!location.state) {
    return <Navigate to='/' />
  }

  return (
    <div className='flex flex-row w-screen h-screen'>
      <div className='bg-[#1c1e29] p-4 text-white flex flex-col w-[200px]' id='aside'>
        <div className='flex-1 '>
          <div className='border-b-2 boder-[#424242]'>
            <img className='h-16 my-2' alt='' src='/code-sync.png' />
          </div>
          <p className='mx-2 my-2'>connected</p>
          <div className='flex items-center flex-wrap gap-5 my-4'>
            {clients?.map(clients => <Client key={clients.socketId} username={clients.username} />)}
          </div>
        </div>
        <button onClick={copyRoomId} className="bg-[#4aee88] hover:bg-[#50cf81] my-2 w-full rounded-md items-center flex h-10 justify-center">
          {/* <svg className="animate-spin w-[20px] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> */}
          <span className='mx-2 flex flex-row items-center font-bold' >Copy ROOM ID <BiSolidCopy className='mx-2 h-4'/></span>
        </button>
        <button onClick={leaveRoom} className="bg-[#ee4a4a] hover:bg-[#ee4a4ad5] my-2 w-full rounded-md items-center flex h-10 justify-center">
          {/* <svg className="animate-spin w-[20px] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> */}
          <span className='mx-2 flex flex-row items-center font-bold' >Leave <BiExit className='mx-2 h-4' /></span>
        </button>
      </div>
      <div id='edit' className='bg-white h-screen'>
        <Editor 
        socketRef={socketRef}
        roomId={RoomId}
        onCodeChange={(code) => {
            codeRef.current = code;
        }}
        />
      </div>
    </div>
  )
}
