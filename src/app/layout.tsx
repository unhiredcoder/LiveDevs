import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";
import Header from "./header";
import Providers from "./providers";
import { Toaster } from 'react-hot-toast';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Live Devs",
  description: "An application to help coding with random devs online ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <NextTopLoader />
          <Toaster />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
