interface HistoryItem {
  month: number;
  year: number;
  count: number;
}

export function history(posts: { date: Date; active: boolean }[]): HistoryItem[] {
  // Filter active posts only
  const activePosts = posts.filter(post => post.active);

  // Group by year and month
  const grouped = activePosts.reduce((acc, post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Convert 0-based to 1-based month
    const key = `${year}-${month}`;

    if (!acc[key]) {
      acc[key] = {
        month,
        year,
        count: 0
      };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, HistoryItem>);

  // Sort from newest to oldest
  return Object.values(grouped).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });
}