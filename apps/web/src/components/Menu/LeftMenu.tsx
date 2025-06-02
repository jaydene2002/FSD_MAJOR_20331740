import { fetchUpdatedPosts } from "@/actions/posts";
import { LeftMenuClient } from "./LeftMenuClient";

export async function LeftMenu() {
  const posts = await fetchUpdatedPosts();
  return <LeftMenuClient posts={posts} />;
}