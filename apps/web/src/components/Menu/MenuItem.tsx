import { FaReact, FaNodeJs, FaRegBookmark, FaBriefcase, FaFileAlt } from "react-icons/fa";

export function MenuItem({
  name,
  link,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  isSelected: boolean;
  title: string;
}) {
  return (
    <li>
      <a
        href={link}
        title={title}
        className={`block hover:text-gray-900 dark:hover:text-gray-200 ${
          isSelected
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className={isSelected ? "" : "grayscale"}>
            {getMenuIcon(name)}
          </div>
          <span data-href={link}>{name}</span>
        </div>
      </a>
    </li>
  );
}

function getMenuIcon(name: string): React.ReactNode {
  switch (name.toLowerCase()) {
    case "react":
      return <FaReact className="h-4 w-4 text-cyan-500" />;
    case "node":
      return <FaNodeJs className="h-4 w-4 text-green-600" />;
    case "mongo":
      return <FaFileAlt className="h-4 w-4 text-green-700" />;
    case "devops":
      return <FaBriefcase className="h-4 w-4 text-gray-500" />;
    default:
      return <FaRegBookmark className="h-4 w-4 text-gray-400" />;
  }
}
