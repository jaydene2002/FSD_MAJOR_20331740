import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Left Menu stays fixed */}
      <LeftMenu />

      {/* Right side container - Main content with proper margin */}
      <div className="ml-0 flex-1 md:ml-64">
        {/* Top menu */}
        <TopMenu query={query} />

        {/* Main content */}
        <main className="h-[calc(100vh-5rem)] flex-1 overflow-hidden">
          <Content query={query}>{children}</Content>
        </main>
      </div>
    </div>
  );
}
