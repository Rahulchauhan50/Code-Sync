import React from 'react'
import Avatar from 'react-avatar'

export default function Client({username}) {  return (
    <div className='flex items-center flex-col mx-auto'>
        <Avatar name={username} size='50' round='14px' color='green' />
        <span>{username}</span>
    </div>
  )
}
