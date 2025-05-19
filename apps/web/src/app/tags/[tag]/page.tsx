import { AppLayout } from "@/components/Layout/AppLayout";
import { getPostsByTag } from "@/functions/tags";
import { Main } from "@/components/Main";
import { fetchUpdatedPosts } from "@/actions/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await fetchUpdatedPosts();
  const filteredPosts = getPostsByTag(posts, tag);

  return (
    <AppLayout>
      <Main initialPosts={filteredPosts} />
    </AppLayout>
  );
}