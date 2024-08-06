import React from 'react'
import { EditRoomForm } from './edit_room_form'
import { getRoom } from '@/data-access/rooms'
import { unstable_noStore } from 'next/cache'

const EditRoom = async ({ params }: { params: { roomId: string } }) => {
  unstable_noStore()
  const room = await getRoom(params.roomId as string)

  if (!room) {
    return <h4>Room not found</h4>
  }

  return (
    <div className="container mx-auto flex flex-col gap-8 pt-12 pb-24 ">
      <h1 className='text-4xl font-bold '>Update Room</h1>
      <EditRoomForm room={room} />
    </div>
  )
}

export default EditRoom 