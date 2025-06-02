import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { fetchUpdatedPosts } from "@/actions/posts";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  // Safely handle the Promise resolution
  const params = await searchParams;
  const q = params.q || ""; // Handle potential undefined value

  // Fetch all posts to allow client-side filtering
  const posts = await fetchUpdatedPosts();

  return (
    <AppLayout query={q}>
      <Main initialPosts={posts} initialSearchQuery={q} />
    </AppLayout>
  );
}

