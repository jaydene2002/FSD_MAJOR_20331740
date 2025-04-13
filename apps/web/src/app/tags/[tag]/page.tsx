import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { getPostsByTag } from "@/functions/tags";
import { Main } from "@/components/Main";

export default async function Page({
  params,
  
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const filteredPosts = getPostsByTag(posts, tag);

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}