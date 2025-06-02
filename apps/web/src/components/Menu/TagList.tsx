"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type Post } from "@repo/db/data";
import { tags } from "@/functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";

export function TagList({ posts }: { posts: Post[] }) {
  const params = useParams();
  const selectedTag = params?.tag;
  const [postTags, setPostTags] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    tags(posts).then(setPostTags);
  }, [posts]);

  return (
    <LinkList>
      {postTags.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={selectedTag === toUrlPath(item.name)}
          link={`/tags/${toUrlPath(item.name)}`}
          title={`Tag / ${item.name}`}
        />
      ))}
    </LinkList>
  );
}