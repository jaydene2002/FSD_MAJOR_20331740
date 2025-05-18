import { loadPaginatedPosts } from "@/actions/posts";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "./page.module.css";

export default async function Home() {
  // Fetch posts from the database
  const { posts } = await loadPaginatedPosts();

  return (
    <AppLayout>
      <Main posts={posts} className={styles.main} />
    </AppLayout>
  );
}
