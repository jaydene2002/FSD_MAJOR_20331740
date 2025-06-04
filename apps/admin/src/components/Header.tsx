import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HeaderActions } from "./HeaderActions";
import { isLoggedIn } from "../utils/auth";

async function logout() {
  "use server";

  // Delete the auth_token cookie to end the user's session
  (await cookies()).delete("auth_token");

  // Redirect to the home page which will show the login form since user is no longer authenticated
  redirect("/");
}

export const Header = async () => {
  const loggedIn = !!(await isLoggedIn());
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <img src="/wsulogo.png" alt="WSU Logo" className="h-auto w-8" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Admin of Full Stack Blog
        </h2>
      </div>
      <HeaderActions logout={logout} loggedIn={loggedIn} />
    </header>
  );
};
