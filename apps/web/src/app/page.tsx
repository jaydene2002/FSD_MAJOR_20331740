import { loadPaginatedPosts } from "@/actions/posts";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import styles from "./page.module.css";

export default async function Home() {
  const { posts, pagination } = await loadPaginatedPosts(1);

  return (
    <AppLayout>
      <Main
        initialPosts={posts}
        totalPages={pagination.totalPages}
        className={styles.main}
      />
    </AppLayout>
  );
}
