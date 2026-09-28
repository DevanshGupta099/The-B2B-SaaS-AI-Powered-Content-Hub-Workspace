"use client";

import React, { useState } from "react";
import { MessageSquare, HardDrive, FileText, Database, Check, Plus } from "lucide-react";
import { getWorkspaceData, updateWorkspaceData } from "@/lib/workspace-data";

// Mock Data
const integrationsList = [
  { id: "slack", name: "Slack", description: "Send notifications and updates to Slack channels.", icon: MessageSquare, color: "text-[#E01E5A]", connected: true },
  { id: "gdrive", name: "Google Drive", description: "Import and sync documents from Google Drive.", icon: HardDrive, color: "text-[#0F9D58]", connected: true },
  { id: "notion", name: "Notion", description: "Sync Nexus pages directly to your Notion workspace.", icon: FileText, color: "text-slate-900", connected: false },
  { id: "salesforce", name: "Salesforce", description: "Link CRM data to your strategy documents.", icon: Database, color: "text-[#00A1E0]", connected: false },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(() => {
    const saved = getWorkspaceData().integrations;
    return integrationsList.map((item) => ({ ...item, connected: saved[item.id] ?? item.connected }));
  });

  const toggleConnection = (id: string) => {
    setIntegrations(prev => {
      const next = prev.map(item => 
        item.id === id ? { ...item, connected: !item.connected } : item
      );
      updateWorkspaceData((data) => ({ ...data, integrations: Object.fromEntries(next.map((item) => [item.id, item.connected])), activity: [`${next.find((item) => item.id === id)?.name} integration updated`, ...data.activity] }));
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 lg:p-12 h-full">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div>
          <h1 className="font-heading text-4xl text-slate-900 tracking-tight">Integrations</h1>
          <p className="text-slate-500 mt-2 text-lg">Connect Nexus with your favorite tools to supercharge your workflow.</p>
        </div>

        {/* Integration List */}
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-indigo-200 transition-colors">
              <div className="flex items-start sm:items-center gap-5">
                <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner ${integration.color}`}>
                  <integration.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading text-xl text-slate-900 mb-1">{integration.name}</h3>
                  <p className="text-slate-500 text-sm font-medium">{integration.description}</p>
                </div>
              </div>
              
              <button 
                onClick={() => toggleConnection(integration.id)}
                className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  integration.connected 
                    ? "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-red-600" 
                    : "bg-[#020617] text-white shadow-md hover:bg-slate-800 hover:shadow-lg"
                }`}
              >
                {integration.connected ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    Connected
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
