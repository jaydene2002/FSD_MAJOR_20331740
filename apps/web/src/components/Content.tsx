import type { PropsWithChildren } from "react";

interface ContentProps {
  query?: string;
}

export function Content({ 
  children,
  query 
}: PropsWithChildren<ContentProps>) {
  return <div className="h-full">{children}</div>;
}