import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { fetchUpdatedPosts } from "@/actions/posts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;

  const posts = await fetchUpdatedPosts();
  // Filter posts based on search query in title or description
  const searchResults = posts.filter(
    (post) =>
      post.active &&
      (post.title.toLowerCase().includes(q.toLowerCase()) ||
        post.description.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <AppLayout query={q}>
      <Main initialPosts={searchResults} />
    </AppLayout>
  );
}