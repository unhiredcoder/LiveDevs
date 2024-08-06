'use client'
import React from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@radix-ui/react-dropdown-menu';
import { HomeIcon, HouseIcon, LogInIcon, LogOutIcon } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface AccountDropDownProps {
    session: any;
    isLoggedIn: boolean;
}

const Header = () => {
    const { data: session } = useSession();
    console.log("🚀 ~ Header ~ data:", session)

    const isLoggedIn: boolean = !!session;

    return (
        <header className='bg-gray-200 shadow-sm mt-4 rounded-full py-4 dark:bg-gray-700 container mx-auto'>
            <div className="flex justify-between items-center font-bold text-gray-800 font-sans text-3xl dark:text-white ">
                LiveDevs
                <div className='flex justify-between items-center gap-4'>
                    {
                        isLoggedIn && (

                            <Button size={'sm'}>
                                <Link
                                    className='flex'
                                    href="your-rooms">My Rooms&nbsp;<HomeIcon size={18} /> </Link>
                            </Button>
                        )
                    }
                    <AccountDropDown session={session} isLoggedIn={isLoggedIn} />

                    <ModeToggle />
                </div>

            </div>
        </header>
    );
};



const AccountDropDown: React.FC<AccountDropDownProps> = ({ session, isLoggedIn }) => {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                {
                    isLoggedIn ?
                        <Button variant={'link'} >
                            <Avatar className='mr-2'>
                                <AvatarImage src={session?.user?.image} alt='@Avtarimage' />
                            </Avatar>
                            {session?.user?.name}
                        </Button>
                        : <></>}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {isLoggedIn ?
                    <DropdownMenuItem className='flex' onClick={() => signOut({ callbackUrl: "/" })}><Button className='bg-red-500' size={'sm'}>LogOut &nbsp;<LogOutIcon size={15} /></Button></DropdownMenuItem> : <></>}
            </DropdownMenuContent>
            {!isLoggedIn ?
                <Button size={'sm'} className='mr-2' onClick={() => signIn('google')}><LogInIcon size={22} />&nbsp;Sign In</Button> : <></>}

        </DropdownMenu>
    );
}

export default Header;
