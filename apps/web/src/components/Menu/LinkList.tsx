interface LinkListProps {
  title?: string;
  children: React.ReactNode;
}

export function LinkList({ title, children }: LinkListProps) {
  return (
    <div className="no-underline">
      {title && <h2 className="mb-2 text-lg font-bold">{title}</h2>}
      <ul className="space-y-2">
        {children}
      </ul>
    </div>
  );
}