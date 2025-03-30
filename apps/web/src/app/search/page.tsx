import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;

  // Filter posts based on search query in title or description
  const searchResults = posts.filter(
    (post) =>
      post.active && (
        post.title.toLowerCase().includes(q.toLowerCase()) ||
        post.description.toLowerCase().includes(q.toLowerCase())
      )
  );

  return (
    <AppLayout query={q}>
      <Main posts={searchResults} />
    </AppLayout>
  );
}