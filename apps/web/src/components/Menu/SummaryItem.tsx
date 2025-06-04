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
        className={`block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 ${
          isSelected ? "text-blue-600 dark:text-blue-400 selected" : ""
        }`}
      >
          <span data-test-id="post-count" className="border border-gray-200 rounded px-2 py-1 mr-2 text-xs text-gray-500 dark:text-gray-300">
            {count}
          </span>
        <span data-href={link}>{name}</span>
      </a>
    </li>
  );
}