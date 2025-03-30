import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  // Filter posts by year and month
  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.date);
    return (
      post.active && 
      postDate.getFullYear() === parseInt(year) &&
      postDate.getMonth() + 1 === parseInt(month)
    );
  });

  return (
    <AppLayout query={undefined}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}