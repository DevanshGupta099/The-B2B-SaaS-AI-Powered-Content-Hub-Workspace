"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, ScanLine, Tag, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VisionResult {
  title: string;
  type: string;
  entities: string[];
  summary: string;
}

export function AiVisionBlock() {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<VisionResult | null>(null);

  const handleUpload = () => {
    // Fake an upload
    setImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop");
    setIsScanning(true);
    
    // Fake the scanning process
    setTimeout(() => {
      setIsScanning(false);
      setResults({
        title: "Q3 Revenue Dashboard Data",
        type: "Data Visualization / Dashboard",
        entities: ["Sales metrics", "Line charts", "KPIs"],
        summary: "The image depicts a dark-mode analytical dashboard showing a 23% increase in MRR. The primary metric highlighted is $1.2M."
      });
    }, 4000);
  };

  return (
    <div className="w-full my-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm font-sans" contentEditable={false}>
      {!image ? (
        <div className="p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl m-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={handleUpload}>
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
            <UploadCloud className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Upload Image for AI Analysis</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">Drop an image here or click to browse. Our vision model will automatically extract text and structure.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Image Container with Scanning Overlay */}
          <div className="relative w-full h-64 bg-slate-100 overflow-hidden group">
            <img src={image} alt="Uploaded" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] z-10"
                >
                  <motion.div 
                    animate={{ y: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 right-0 h-1 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
                    <ScanLine className="w-10 h-10 mb-3 animate-pulse text-indigo-200" />
                    <span className="text-sm font-bold tracking-widest uppercase text-indigo-100 drop-shadow-md">Analyzing Image...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Structured Data Output */}
          <AnimatePresence>
            {results && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-slate-200 bg-white"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 
                      {results.title}
                    </h4>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Vision Ready</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Type</div>
                      <div className="text-sm text-slate-900">{results.type}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Summary</div>
                      <div className="text-sm text-slate-900 line-clamp-2 leading-relaxed">{results.summary}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="secondary" size="sm" className="flex-1">Insert as Table</Button>
                    <Button variant="secondary" size="sm" className="flex-1">Copy Data</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
