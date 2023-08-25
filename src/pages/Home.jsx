import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { v4 as newRoomId } from 'uuid'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const [roomId, setRoomId] = useState()
    const [username, setUsername] = useState()
    const navigate = useNavigate();
    const createNewRoom = () => {
        const id = newRoomId();
        setRoomId(id);
        toast.success("New room Created sucessfully")
        console.log(id);
    }

    const joinRoom = () => {
        if(!roomId || !username){
            toast.error('ROOM ID & Username is required')
        }else{
            navigate(`/editor/${roomId}`,{state: {
                username,
            }})
        }

    }
    return (
        <div className='flex items-center justify-center text-white h-screen'>
            <div className='bg-[#282a36] p-5 rounded-xl w-[400px] max-w-[90vw]'>
                <img className='h-20' src='/code-sync.png' alt='code-sync' />
                <p className='mb-4'>Paste Invitation RoomID</p>
                <form onSubmit={joinRoom} className='flex flex-col items-end'>
                    <input required onChange={(e)=>setRoomId(e.target.value)} value={roomId} className='w-full p-[10px] text-slate-800 font-bold outline-none my-2 border-transparent border-2 bg-[#eee] hover:border-blue-900 rounded-md' type='text' placeholder='ROOM ID' />
                    <input required onChange={(e)=>setUsername(e.target.value)} value={username} className='w-full p-[10px] text-slate-800 font-bold outline-none my-2 border-transparent border-2 bg-[#eee] hover:border-blue-900 rounded-md' type='text' placeholder='USERNAME' />
                    <button onClick={joinRoom} type="submit" className="bg-[#4aee88] hover:bg-[#50cf81] my-2 w-[100px] rounded-md items-center flex h-10 justify-center">
                        {/* <svg className="animate-spin w-[20px] text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> */}
                        <span className='mx-2' >Join</span>
                    </button>
                </form>
                <p className='text-[12px] flex justify-center'>If you Don't have invitation ROOM ID then create&nbsp;<button onClick={createNewRoom} className='text-[#4aee88] font-semibold hover:underline transition-all duration-100' href='/' >New Room</button></p>
            </div>
            <div className='fixed bottom-0 my-4'>
                <p>Created by - <a href='/' className='text-[#4aee88]'>Rahul chauhan</a></p>
            </div>
        </div>
    )
}
