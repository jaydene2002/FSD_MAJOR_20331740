export function Switch({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        className={`rounded py-1 text-sm font-medium focus:outline-none`}
        tabIndex={-1}
        onClick={onToggle}
      >
        {active ? "Active" : "Inactive"}
      </button>
      <div className="relative">
        <input
          type="checkbox"
          checked={active}
          onChange={onToggle}
          className="sr-only"
        />
        <div
          className={`h-6 w-10 rounded-full transition-colors duration-200 ${
            active ? "bg-green-600" : "bg-gray-400"
          }`}
        />
        <div
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
            active ? "translate-x-4" : ""
          }`}
        />
      </div>
    </label>
  );
}
