import { posts } from "@repo/db/data";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
export default function Home() {
  const homePagePosts = posts.map(post => {
    if (post.id === 1) {
      return { ...post, views: 320 };
    }
    return post;
  });
  return (
    <AppLayout>
      <Main posts={posts} className={styles.main} />
    </AppLayout>
  );
}
