"use client";

import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export const HeaderActions = ({ logout }: { logout: () => void }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        className={`
          flex gap-4
          ${open ? "flex-col absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg z-50 p-4" : ""}
          ${open ? "md:hidden" : "hidden md:flex"}
        `}
      >
        <Link
          href="/posts/create"
          className="rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-700"
          onClick={() => setOpen(false)}
        >
          Create Post
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg bg-white px-4 py-2 text-red-900 outline outline-red-900 hover:text-white hover:bg-red-900 w-full text-left"
            onClick={() => setOpen(false)}
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};