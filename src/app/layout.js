import { Inter } from "next/font/google";
import "./globals.css";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Delight Login",
};

export default function RootLayout({ children }) {
  return (
    <html className="h-full dark" lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body className={twMerge("h-full bg-gray-50 dark:bg-gray-900", inter.className)}>
        {children}
      </body>
    </html>
  );
}
