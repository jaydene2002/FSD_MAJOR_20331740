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
    <li className={isSelected ? "selected" : ""}>
      <a 
        href={link} 
        title={title}
        className={`block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 ${
          isSelected ? "text-blue-600 dark:text-blue-400" : ""
        }`}
      >
        {name}
        {count > 0 && (
          <span data-test-id="post-count" className="ml-1">
            ({count})
          </span>
        )}
      </a>
    </li>
  );
}