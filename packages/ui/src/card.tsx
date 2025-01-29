import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={className}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="text-blue-300">{title}</div>
      <h2 className="bg-red-800 p-8">
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
