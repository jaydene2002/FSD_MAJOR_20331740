"use client";
/**
 * Header actions component for the admin interface
 * 
 * This component provides navigation and action buttons in the header section,
 * including a responsive dropdown menu for mobile devices.
 * 
 * Features:
 * - Link to client site in a new tab
 * - Create post button (when logged in)
 * - Logout functionality (when logged in)
 * - Responsive menu that collapses on mobile devices
 * - Click-outside detection to close the menu
 */
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaPlus, FaShare } from "react-icons/fa";
import Link from "next/link";

export const HeaderActions = ({
  logout,
  loggedIn,
}: {
  logout: () => void;
  loggedIn: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3001/";

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        className="md:hidden p-2"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
      >
        {open ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      <div
        className={`flex gap-4 ${open ? "absolute right-0 z-50 mt-2 w-48 flex-col rounded bg-white p-4 shadow-lg dark:bg-gray-800" : ""} ${open ? "md:hidden" : "hidden md:flex"} `}
      >
        <Link
          href={clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
          onClick={() => setOpen(false)}
        >
          <FaShare />
          Go to Client
        </Link>
        {loggedIn && (
          <>
            <Link
              href="/posts/create"
              className="flex items-center gap-2 rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-700"
              onClick={() => setOpen(false)}
            >
              <FaPlus />
              Create Post
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-lg bg-white px-4 py-2 text-left text-red-900 outline outline-red-900 hover:bg-red-900 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Logout
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
