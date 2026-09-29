import { sql, isDatabaseConfigured } from "./db";
import { BackendUser, BackendWorkspace, BackendDocument, BackendMediaAsset, BackendActivityLog } from "./server-store";

export interface DBUserRow {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  workspace_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface DBDocumentRow {
  id: string;
  workspace_id: string;
  title: string;
  content: string;
  status: string;
  version: number;
  compliance_score: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DBWorkspaceRow {
  id: string;
  name: string;
  description: string | null;
  docs_count: number;
  owner_id: string | null;
  created_at: string;
}

/**
 * Neon PostgreSQL Data Access Repository
 * Communicates with serverless PostgreSQL on AWS us-east-1 (Neon project: nexus-content-hub)
 */
export const dbRepo = {
  async findUserByEmail(email: string): Promise<BackendUser | null> {
    if (!sql || !isDatabaseConfigured()) return null;
    try {
      const rows = await sql`
        SELECT id, name, email, password, role, workspace_name, avatar_url, created_at 
        FROM users 
        WHERE LOWER(email) = LOWER(${email.trim()}) 
        LIMIT 1
      `;
      if (!rows || rows.length === 0) return null;
      const row = rows[0] as DBUserRow;
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        workspaceName: row.workspace_name ?? undefined,
        createdAt: row.created_at
      };
    } catch (err) {
      console.warn("Neon DB query error in findUserByEmail:", err);
      return null;
    }
  },

  async createUser(user: BackendUser): Promise<boolean> {
    if (!sql || !isDatabaseConfigured()) return false;
    try {
      await sql`
        INSERT INTO users (id, name, email, password, role, workspace_name, avatar_url, created_at)
        VALUES (
          ${user.id}, 
          ${user.name}, 
          ${user.email.toLowerCase()}, 
          ${user.password}, 
          ${user.role}, 
          ${user.workspaceName || null}, 
          ${"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}, 
          ${user.createdAt}
        )
        ON CONFLICT (email) DO UPDATE 
        SET name = EXCLUDED.name, 
            password = EXCLUDED.password, 
            role = EXCLUDED.role, 
            workspace_name = EXCLUDED.workspace_name;
      `;
      return true;
    } catch (err) {
      console.warn("Neon DB insert error in createUser:", err);
      return false;
    }
  },

  async getWorkspaces(): Promise<BackendWorkspace[] | null> {
    if (!sql || !isDatabaseConfigured()) return null;
    try {
      const rows = await sql`
        SELECT id, name, description, docs_count, owner_id, created_at 
        FROM workspaces 
        ORDER BY id ASC
      `;
      if (!rows || rows.length === 0) return null;
      return (rows as DBWorkspaceRow[]).map(r => ({
        id: r.id,
        name: r.name,
        desc: r.description || "",
        docsCount: r.docs_count,
        membersCount: 4,
        color: "bg-indigo-600",
        users: [
          { id: "u1", name: "Devansh", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80" },
          { id: "u2", name: "Sarah", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" }
        ],
        tags: ["Production", "AI Governance"],
        createdAt: r.created_at
      }));
    } catch (err) {
      console.warn("Neon DB query error in getWorkspaces:", err);
      return null;
    }
  },

  async getDocuments(workspaceId?: string): Promise<BackendDocument[] | null> {
    if (!sql || !isDatabaseConfigured()) return null;
    try {
      const rows = workspaceId 
        ? await sql`SELECT * FROM documents WHERE workspace_id = ${workspaceId} ORDER BY updated_at DESC`
        : await sql`SELECT * FROM documents ORDER BY updated_at DESC`;
      if (!rows || rows.length === 0) return null;
      return (rows as DBDocumentRow[]).map(r => ({
        id: r.id,
        workspaceId: r.workspace_id,
        title: r.title,
        content: r.content,
        workspace: "Marketing" as const,
        updatedAt: r.updated_at,
        author: "Nexus Autonomous Agent",
        status: (r.status === "published" ? "Published" : r.status === "in-review" ? "In Review" : "Draft") as "Draft" | "In Review" | "Approved" | "Published",
        tags: r.tags || []
      }));
    } catch (err) {
      console.warn("Neon DB query error in getDocuments:", err);
      return null;
    }
  },

  async saveDocument(doc: BackendDocument): Promise<boolean> {
    if (!sql || !isDatabaseConfigured()) return false;
    try {
      await sql`
        INSERT INTO documents (id, workspace_id, title, content, status, version, compliance_score, tags, updated_at)
        VALUES (
          ${doc.id},
          ${doc.workspaceId || "1"},
          ${doc.title},
          ${doc.content},
          ${(doc.status || "Draft").toLowerCase()},
          1,
          99.4,
          ${doc.tags || []},
          NOW()
        )
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            content = EXCLUDED.content,
            status = EXCLUDED.status,
            tags = EXCLUDED.tags,
            updated_at = NOW();
      `;
      return true;
    } catch (err) {
      console.warn("Neon DB save error in saveDocument:", err);
      return false;
    }
  },

  async logActivity(user: string, action: string, document: string, avatar?: string): Promise<void> {
    if (!sql || !isDatabaseConfigured()) return;
    try {
      await sql`
        INSERT INTO audit_activities (user_name, action, document_name, avatar, created_at)
        VALUES (
          ${user}, 
          ${action}, 
          ${document}, 
          ${avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}, 
          NOW()
        );
      `;
    } catch (err) {
      console.warn("Neon DB activity log error:", err);
    }
  }
};
