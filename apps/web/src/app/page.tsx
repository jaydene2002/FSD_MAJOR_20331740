import { headers } from "next/headers";
import { loadPaginatedPosts } from "@/actions/posts";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "./page.module.css";
import { UserProvider } from "@/app/context/UserContext";

export default async function Home() {
  const headersList = await headers();
  const userIP = headersList.get("x-forwarded-for") || "";
  const { posts, pagination } = await loadPaginatedPosts(1, undefined, userIP);

  return (
    <AppLayout>
      <UserProvider userIp={userIP}>
        <Main
          initialPosts={posts}
          totalPages={pagination.totalPages}
          className={styles.main}
        />
      </UserProvider>
    </AppLayout>
  );
}
