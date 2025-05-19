import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { fetchUpdatedPosts } from "@/actions/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;

  const posts = await fetchUpdatedPosts();
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
      <Main initialPosts={filteredPosts} />
    </AppLayout>
  );
}