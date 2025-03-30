import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  // Show ALL posts (active or inactive) from the selected category
  const categoryPosts = posts.filter(
    (post) => post.category.toLowerCase() === name.toLowerCase()
  );

  return (
    <AppLayout>
      <Main posts={categoryPosts} />
    </AppLayout>
  );
}
