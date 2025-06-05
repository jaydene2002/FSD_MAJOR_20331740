"use client";

import { useParams } from "next/navigation";
import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";
import { LinkList } from "./LinkList";
//Displays history of posts in a sidebar menu based on active posts
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function HistoryList({ posts }: { posts: Post[] }) {
  const params = useParams();
  const selectedYear = params?.year;
  const selectedMonth = params?.month;

  const historyItems = history(posts);

  return (
    <LinkList>
      {historyItems.map((item) => (
        <SummaryItem
          key={`${item.year}-${item.month}`}
          count={item.count}
          name={`${months[item.month]}, ${item.year}`}
          isSelected={
            selectedYear === item.year.toString() &&
            selectedMonth === item.month.toString()
          }
          link={`/history/${item.year}/${item.month}`}
          title={`History / ${months[item.month]}, ${item.year}`}
        />
      ))}
    </LinkList>
  );
}