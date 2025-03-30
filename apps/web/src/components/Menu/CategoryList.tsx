import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({ posts }: { posts: Post[] }) {
  // Compute categories from posts (might only return Node and React)
  const computedCategories = categories(posts);

  // Check if Mongo and DevOps are already included (ignoring case)
  const hasMongo = computedCategories.find(
    (c) => c.name.toLowerCase() === "mongo"
  );
  const hasDevOps = computedCategories.find(
    (c) => c.name.toLowerCase() === "devops"
  );

  // Manually add them if they're missing
  if (!hasMongo) {
    computedCategories.push({ name: "Mongo", count: 0 });
  }
  if (!hasDevOps) {
    computedCategories.push({ name: "DevOps", count: 0 });
  }

  return (
    <LinkList>
      {computedCategories.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={false}
          link={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}