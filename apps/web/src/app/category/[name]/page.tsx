import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: { name: string };  // Changed from tag to name to match the folder structure
}) {
  // Filter posts by category
  const filteredPosts = posts.filter(post => 
    post.active && post.category.toLowerCase() === params.name.toLowerCase()
  );

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}