import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Delight User",
};

export default function UserDataLayout({ children }) {
  return (
    <div className={twMerge("h-full bg-gray-100 dark:bg-gray-900", inter.className)}>{children}</div>
  );
}
