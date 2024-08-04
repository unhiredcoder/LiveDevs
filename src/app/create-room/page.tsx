import React from 'react'
import { CreateRoomForm } from './create_room_form'

const CreateRoom = () => {
  return (
    <div className="container mx-auto flex flex-col gap-8 pt-12 pb-24 ">
        <h1 className='text-4xl font-bold '>Create Room</h1>
        <CreateRoomForm/>
    </div>
  )
}

export default CreateRoom 