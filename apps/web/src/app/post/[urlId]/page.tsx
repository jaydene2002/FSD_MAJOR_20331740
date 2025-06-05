import { AppLayout } from "@/components/Layout/AppLayout";
import { getPostWithLikeStatus, incrementViews } from "@/actions/posts";
import { Post } from "@/components/Blog/Post";
import { headers } from "next/headers";
import { client } from "@repo/db/client";
import BackButton from "@/components/Blog/BackButton"; 

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const headersList = await headers();
  const userIP = headersList.get("x-forwarded-for") || "";

  // Fetch post by urlId
  const postRecord = await client.db.post.findUnique({ where: { urlId, active: true } });
  if (!postRecord) {
    return <AppLayout>Article not found</AppLayout>;
  }

  // Now use the numeric id
  const post = await getPostWithLikeStatus(postRecord.id, userIP);

  if (!post || post.id === undefined) {
    return <AppLayout>Article not found</AppLayout>;
  }

  await incrementViews(post.id);

  return (
    <AppLayout>
      <div className="my-0 h-full overflow-y-auto pt-2">
        <div className="mx-auto max-w-4xl px-6">
          <BackButton />
        </div>
        <Post post={{ ...post, views: (post.views ?? 0) + 1 }} userIp={userIP} />
      </div>
    </AppLayout>
  );
}