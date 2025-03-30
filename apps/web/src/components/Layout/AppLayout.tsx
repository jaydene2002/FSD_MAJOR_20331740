import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <TopMenu query={query} />
      </div>
      
      <div className="flex pt-16">
        <aside className="fixed left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <LeftMenu />
        </aside>
        
        <main className="flex-1 ml-64 p-8">
          <Content>{children}</Content>
        </main>
      </div>
    </div>
  );
}