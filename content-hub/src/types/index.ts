export type TeamRole = "Super Admin" | "Admin" | "Editor" | "Viewer" | "External Client";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: TeamRole;
  status: "Active" | "Invited" | "Inactive";
  lastActiveAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  members: User[];
  folders: WorkspaceFolder[];
}

export interface WorkspaceFolder {
  id: string;
  name: string;
  files: DocumentBlock[];
}

export interface DocumentBlock {
  id: string;
  title: string;
  type: "document" | "canvas" | "spreadsheet";
  updatedAt: string;
  updatedBy: string;
}

export interface CursorPosition {
  id: string;
  userId: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface Subscription {
  plan: "Pro" | "Enterprise";
  status: "Active" | "Past Due" | "Canceled";
  aiTokensUsed: number;
  aiTokensLimit: number;
  currentPeriodEnd: string;
}
