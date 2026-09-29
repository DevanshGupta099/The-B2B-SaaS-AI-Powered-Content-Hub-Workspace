"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize";

export interface CursorPosition {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface MultiplayerPresenceProps {
  cursors: CursorPosition[];
}

function MultiplayerPresence({ cursors }: MultiplayerPresenceProps) {
  return (
    <>
      {cursors.map((cursor) => (
        <motion.div
          key={cursor.id}
          className="absolute z-10 pointer-events-none flex flex-col items-start drop-shadow-md"
          initial={{ x: cursor.x, y: cursor.y, opacity: 0 }}
          animate={{ x: cursor.x, y: cursor.y, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 250,
            mass: 0.5
          }}
        >
          {/* Custom SVG Caret */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-5 h-5 -ml-1 -mt-1 drop-shadow-sm", cursor.color)}>
            <path d="M5.65376 21.2673C5.17056 21.6702 4.42857 21.3259 4.42857 20.6974V3.19069C4.42857 2.47895 5.34006 2.17478 5.76756 2.74411L18.4237 19.5937C18.8471 20.1573 18.3976 20.9702 17.6973 20.9051L12.3923 20.4124C12.062 20.3817 11.7371 20.5054 11.503 20.748L5.65376 21.2673Z" fill="currentColor" stroke="white" strokeWidth="1.5"/>
          </svg>
          <div className={cn("px-2 py-0.5 text-[10px] font-bold text-white rounded-full mt-1", cursor.color.replace("text-", "bg-"))}>
            {cursor.name}
          </div>
        </motion.div>
      ))}
    </>
  );
}

export interface EditorCanvasProps {
  title?: string;
  initialHtml?: string;
  cursors?: CursorPosition[];
}

export function EditorCanvas({ title = "Untitled", initialHtml = "", cursors = [] }: EditorCanvasProps) {
  return (
    <div className="relative w-full h-full">
      {/* Absolute bounding box for cursors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <MultiplayerPresence cursors={cursors} />
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
        {/* Document Title */}
        <input 
          type="text"
          className="w-full text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-8 border-none bg-transparent placeholder-slate-300 focus:outline-none focus:ring-0 p-0"
          defaultValue={title}
          placeholder="Document Title"
        />

        {/* Typographic Shell for Headless Editor Mount */}
        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 outline-none">
          <div 
            contentEditable 
            suppressContentEditableWarning 
            className="min-h-[300px] outline-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(initialHtml || "<p>Start typing...</p>") }}
          />
        </div>
      </div>
    </div>
  );
}
