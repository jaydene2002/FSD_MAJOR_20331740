"use client";

import { usePathname } from "next/navigation";
import { ADMIN_URL } from "@/config";

export function BaseList() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <ul role="list" className="mb-6 flex flex-1 flex-col gap-y-2">
      <li>
        <a
          href="/"
          className={`text-lg font-medium hover:text-gray-900 dark:hover:text-white ${
            isHome
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Home
        </a>
      </li>

      <li>
        <a
          href={ADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          Admin
        </a>
      </li>
    </ul>
  );
}
