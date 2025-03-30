import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { getPostsByTag } from "@/functions/tags";
import { Main } from "@/components/Main";

export default async function Page({
  params,
  searchParams,
}: {
  params: { tag: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const filteredPosts = getPostsByTag(posts, params.tag);

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}