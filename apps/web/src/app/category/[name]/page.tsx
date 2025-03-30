import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { getPostsByTag } from "@/functions/tags";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: { tag: string };  // Remove Promise and searchParams since they're not needed
}) {
  const filteredPosts = getPostsByTag(posts, params.tag);

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}