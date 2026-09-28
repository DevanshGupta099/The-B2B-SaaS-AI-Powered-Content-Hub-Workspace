import React from "react";
import { AppLayout, WorkspaceFolder } from "@/components/AppLayout";
import { AiCommandMenu } from "@/components/AiCommandMenu";

const mockFolders: WorkspaceFolder[] = [
  {
    id: "f1",
    name: "Engineering",
    files: [
      { id: "doc1", name: "Architecture RFC" },
      { id: "doc2", name: "API Documentation" },
    ]
  },
  {
    id: "f2",
    name: "Marketing",
    files: [
      { id: "doc3", name: "Q4 Strategy" },
      { id: "doc4", name: "Brand Guidelines" },
    ]
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppLayout folders={mockFolders}>
        {children}
      </AppLayout>
      <AiCommandMenu />
    </>
  );
}
