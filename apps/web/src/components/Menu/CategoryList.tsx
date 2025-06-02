"use client";

import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { LinkList } from "./LinkList";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/components/Menu/MenuItem";

export function CategoryList({ posts }: { posts: Post[] }) {
  const pathname = usePathname();
  const selectedCategory =
    pathname && pathname.startsWith("/category/")
      ? decodeURIComponent(pathname.split("/category/")[1] || "")
      : "";

  const computedCategories = categories(posts);

  const hasMongo = computedCategories.find(
    (c) => c.name.toLowerCase() === "mongo",
  );
  const hasDevOps = computedCategories.find(
    (c) => c.name.toLowerCase() === "devops",
  );

  if (!hasMongo) {
    computedCategories.push({ name: "Mongo", count: 0 });
  }
  if (!hasDevOps) {
    computedCategories.push({ name: "DevOps", count: 0 });
  }

  return (
    <LinkList>
      {computedCategories.map((item) => {
        const urlPath = toUrlPath(item.name);
        const isSelected =
          selectedCategory.toLowerCase() === urlPath.toLowerCase();
        return (
          <MenuItem
            key={item.name}
            name={item.name}
            isSelected={isSelected}
            link={`/category/${urlPath}`}
            title={`Category / ${item.name}`}
          />
        );
      })}
    </LinkList>
  );
}
