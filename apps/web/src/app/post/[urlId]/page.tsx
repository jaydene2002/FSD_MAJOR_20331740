import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { incrementViews } from "@/actions/posts";
import { Post } from "@/components/Blog/Post";
import { headers } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const headersList = await headers();
  const userIP = headersList.get("x-forwarded-for") || "";

  const post = posts.find((p) => p.urlId === urlId && p.active);

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  await incrementViews(post.id);

  return (
    <AppLayout>
      <Post post={post} userIp={userIP} />
    </AppLayout>
  );
}