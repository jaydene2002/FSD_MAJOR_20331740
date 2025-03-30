import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    <div className="p-4 pt-6"> {/* Added pt-6 to prevent Categories from being cut off */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
      </div>
      
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li className="space-y-3">
            <CategoryList posts={posts} />
          </li>
          
          <li className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">History</h2> {/* Added heading with same styling */}
            <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          </li>
          
          <li className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h2>
            <TagList selectedTag="" posts={posts} />
          </li>
          
          <li className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
            <a 
              href="/admin" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              Admin
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}