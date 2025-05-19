import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { fetchUpdatedPosts } from "@/actions/posts";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const posts = await fetchUpdatedPosts();
  const categoryPosts = posts.filter(
    (post) => post.category.toLowerCase() === name.toLowerCase(),
  );

  return (
    <AppLayout>
      <Main initialPosts={categoryPosts} />
    </AppLayout>
  );
}