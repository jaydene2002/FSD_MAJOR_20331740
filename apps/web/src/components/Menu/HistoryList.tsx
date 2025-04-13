import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";
import { LinkList } from "./LinkList";

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
export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  return (
    <LinkList> {}
      {historyItems.map((item) => (
        <SummaryItem
          key={`${item.year}-${item.month}`}
          count={item.count}
          name={`${months[item.month]}, ${item.year}`}
          isSelected={selectedYear === item.year.toString() && selectedMonth === item.month.toString()}
          link={`/history/${item.year}/${item.month}`}
          title={`History / ${months[item.month]}, ${item.year}`}
        />
      ))}
    </LinkList>
  );
}