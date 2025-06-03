import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {HeaderActions} from "./HeaderActions";

async function logout() {
  "use server";

  // Delete the auth_token cookie to end the user's session
  (await cookies()).delete("auth_token");

  // Redirect to the home page which will show the login form since user is no longer authenticated
  redirect("/");
}

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <img src="/wsulogo.png" alt="WSU Logo" className="h-auto w-8" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Admin of Full Stack Blog
        </h2>
      </div>
      <HeaderActions logout={logout} />
    </header>
  );
};
