'use client'
import { Badge } from '@/components/ui/badge';
import { getRoom } from '@/data-access/rooms';
import { GithubIcon, Loader2Icon, LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DevFinderVideo } from './video-player';
import { Chat, Channel, MessageInput, MessageList, Thread, Window, ChannelHeader } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/index.css'; // Optional: include Stream's CSS
import { generateTokenAction } from './action';
import { useTheme } from 'next-themes';
import { getSession } from '@/lib/auth';
import { useSession } from 'next-auth/react';
import { LoadingIndicator } from '@stream-io/video-react-sdk';

interface Props {
  params: {
    roomId: string;
  };
}

const RoomPage: React.FC<Props> = ({ params }) => {
  const { roomId } = params;
  const [room, setRoom] = useState<any>(null);
  const [chatClient, setChatClient] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const user = useSession()
  // console.log("🚀 ~ user:", user)

  useEffect(() => {
    const fetchRoom = async () => {
      const fetchedRoom = await getRoom(roomId);
      setRoom(fetchedRoom);

      const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY!;
      const chatClient = new StreamChat(apiKey);
      const userId = fetchedRoom?.userId; // Replace with appropriate user ID
      const userToken = await generateTokenAction(); // Implement your token generation function
      await chatClient.connectUser({ id: userId as string }, userToken);

      const channel = chatClient.channel('messaging', roomId, {
        // Additional options if needed
      });
      await channel.watch();

      setChatClient(chatClient);
      setChannel(channel);
    };

    fetchRoom();

    return () => {
      if (channel) channel.stopWatching();
      if (chatClient) chatClient.disconnectUser();
    };
  }, [roomId]);

  if (!room) {
    return <div className='flex items-center justify-center h-screen w-screen text-2xl'><LoaderIcon className='animate-spin' size={30} /> </div>;
  }

  const { theme } = useTheme()
  const languages = room.languages?.split(',').map((lang: string) => lang.trim());

  return (
    <div className='grid grid-cols-4  min-h-screen '>
      <div className='col-span-3 p-4 pb-0'>
        <div className='bg-gray-100 text-card-foreground rounded-sm p-6 border shadow-md  dark:bg-[#020817]'>
          <DevFinderVideo room={room} />
        </div>
      </div>
      <div className='col-span-1 p-1 mt-3 mr-3 pl-0 relative '>
        <div className='bg-gray-100 text-card-foreground rounded-sm p-4 border shadow-md flex flex-col gap-4 dark:bg-[#020817]'>
          <h1 className='font-extrabold text-2xl'>{room.name}</h1>
          <p className='text-base text-gray-500'>{room.description}</p>
          <div className='flex flex-wrap gap-2'>
            {languages?.map((lang: any) => (
              <Badge className='w-fit capitalize' key={lang}>
                {lang}
              </Badge>
            ))}
          </div>
          {room.githubRepo && (
            <Link href={room.githubRepo} className='flex items-center gap-2 self-center text-sm' target='_blank' rel='noopener noreferrer'>
              <GithubIcon />
              <div className='font-semibold'>Github Project</div>
            </Link>
          )}

          {/* Stream Chat */}
          {chatClient && channel && (
            <div className='chat-container border '>
              <Chat client={chatClient}  theme={`messaging ${theme === "dark" ? "dark" : "light"}`}>
                <Channel channel={channel}>
                  <Window>
                    <ChannelHeader title='Diccuss problems'  image={user.data?.user.image as string} />
                    <MessageList />
                    <MessageInput />
                  </Window>
                </Channel>
              </Chat>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
