import { posts } from "@repo/db/data";
import { getPostsByTag } from "../../../functions/tags";
import { BlogListItem } from "../../../components/Blog/ListItem";

export default async function TagPage({ params }: { params: { tag: string } }) {
  const filteredPosts = getPostsByTag(posts, params.tag);

  return (
    <div>
      <h1>Tag: {params.tag}</h1>
      {filteredPosts.length === 0 ? (
        <p>0 Posts</p>
      ) : (
        <div>
          {filteredPosts.map((post) => (
            <BlogListItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}