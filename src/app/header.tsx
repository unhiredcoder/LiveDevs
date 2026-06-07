'use client'
import React, { useState } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import {
  BookmarkIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

const Header = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-gray-200 dark:bg-gray-700 shadow-sm mt-2 sm:mt-4 rounded-2xl sm:rounded-full py-3 sm:py-4 container mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center font-bold text-gray-800 dark:text-white font-sans text-xl sm:text-3xl">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          LiveDevs
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn && (
            <>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/your-rooms" className="flex items-center gap-1">
                  My Rooms <HomeIcon size={16} />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/saved" className="flex items-center gap-1">
                  Saved <BookmarkIcon size={16} />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/profile/${session.user.id}`} className="flex items-center gap-1">
                  Profile <UserIcon size={16} />
                </Link>
              </Button>
            </>
          )}
          <AccountDropDown session={session} isLoggedIn={isLoggedIn} />
          <ModeToggle />
        </div>

        {/* Mobile: toggle + mode */}
        <div className="flex sm:hidden items-center gap-2">
          <ModeToggle />
          {isLoggedIn && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </Button>
          )}
          {!isLoggedIn && (
            <Button size="sm" onClick={() => signIn('google')}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && isLoggedIn && (
        <div className="sm:hidden mt-3 flex flex-col gap-2 border-t pt-3 dark:border-gray-600">
          <Link
            href="/your-rooms"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-base font-medium"
          >
            <HomeIcon size={18} /> My Rooms
          </Link>
          <Link
            href="/saved"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-base font-medium"
          >
            <BookmarkIcon size={18} /> Saved Rooms
          </Link>
          <Link
            href={`/profile/${session.user.id}`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-base font-medium"
          >
            <UserIcon size={18} /> Profile
          </Link>
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{session?.user?.name}</span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }) }}
          >
            <LogOutIcon size={15} className="mr-2" /> Sign Out
          </Button>
        </div>
      )}
    </header>
  );
};

const AccountDropDown = ({
  session,
  isLoggedIn,
}: {
  session: any;
  isLoggedIn: boolean;
}) => {
  if (!isLoggedIn) {
    return (
      <Button size="sm" onClick={() => signIn('google')}>
        Sign In
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="flex items-center gap-2 p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">
            {session?.user?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-1 min-w-[160px] z-50">
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOutIcon size={15} /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Header;
