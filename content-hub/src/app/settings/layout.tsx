import React from "react";
import { AppLayout, WorkspaceFolder } from "@/components/AppLayout";
import { AiCommandMenu } from "@/components/AiCommandMenu";

const mockFolders: WorkspaceFolder[] = [];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppLayout folders={mockFolders}>
        {children}
      </AppLayout>
      <AiCommandMenu />
    </>
  );
}
