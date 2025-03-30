import type { PropsWithChildren } from "react";

export function LinkList({ children }: PropsWithChildren) {
  return (
    <div className="no-underline">
      <ul className="space-y-1">
        {children}
      </ul>
    </div>
  );
}