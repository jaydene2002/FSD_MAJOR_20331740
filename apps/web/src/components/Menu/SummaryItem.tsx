export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title: string;
}) {
  return (
    <li>
      <a
        href={link}
        title={title}
        className={`block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 ${
          isSelected ? "selected text-blue-600 dark:text-blue-400" : ""
        }`}
      >
        <span
          data-test-id="post-count"
          className="mr-2 rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 dark:text-gray-300"
        >
          {count}
        </span>
        <span data-href={link}>{name}</span>
      </a>
    </li>
  );
}
