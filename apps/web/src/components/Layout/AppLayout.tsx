import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-gray-900">
      {/* Sidebar - Left Menu stays fixed */}
      <LeftMenu />
      
      {/* Right side container - Main content with proper margin */}
      <div className="flex-1 ml-0 md:ml-64">
        {/* Top menu */}
        <div className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <TopMenu query={query} />
        </div>
        
        {/* Main content */}
        <main className="h-full flex-1 overflow-hidden">
          <Content query={query}>{children}</Content>
        </main>
      </div>
    </div>
  );
}
