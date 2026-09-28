"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Sparkles, 
  Languages, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  RefreshCw, 
  ArrowRight, 
  Lock, 
  Sliders, 
  BookOpen, 
  Plus, 
  FileText,
  BookmarkPlus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastNotifications";
import { getWorkspaceData, updateWorkspaceData, LocalizationEntry } from "@/lib/workspace-data";
import { createDocument } from "@/lib/documents";

const languages = [
  { code: "de", name: "German (DE)", flag: "🇩🇪", region: "DACH Region" },
  { code: "ja", name: "Japanese (JA)", flag: "🇯🇵", region: "APAC / Japan" },
  { code: "fr", name: "French (FR)", flag: "🇫🇷", region: "Europe / Francophone" },
  { code: "es", name: "Spanish (ES)", flag: "🇪🇸", region: "Latin America / Spain" },
  { code: "pt", name: "Portuguese (BR)", flag: "🇧🇷", region: "Brazil / LatAm" },
  { code: "zh", name: "Mandarin (ZH)", flag: "🇨🇳", region: "East Asia" },
];

const mockTranslations: Record<string, string> = {
  de: `## Nexus: Das KI-gestützte Content-Betriebssystem für B2B-Unternehmen\n\nModerne Marketingteams stehen vor der Herausforderung, Content-Geschwindigkeit mit strenger Brand-Governance zu vereinbaren.\n\n### Wichtigste Vorteile\n• 65 % schnellere Kampagnenausführung ohne Compliance-Risiken.\n• Vollständige Integration mit Webflow, HubSpot und LinkedIn.\n• Zentrales Brand Kit zur Vermeidung von Halluzinationen.`,
  ja: `## Nexus: B2B企業向けAI搭載コンテンツ・オペレーティングシステム\n\nエンタープライズのマーケティングチームは、ブランドガバナンスを損なうことなく、コンテンツ制作の迅速化を実現する必要があります。\n\n### 主な強み\n• コンプライアンス違反ゼロでキャンペーン展開スピードを65%向上。\n• Webflow、HubSpot、LinkedInとのシームレスな直接パブリッシング。\n• ブランドガイドラインに厳格に準拠したAI生成エンジン。`,
  fr: `## Nexus : Le système d'exploitation de contenu propulsé par l'IA pour le B2B\n\nLes équipes marketing modernes doivent concilier vélocité de production et stricte gouvernance de marque.\n\n### Avantages clés\n• Réduction de 65 % des délais de campagne sans compromis sur la conformité.\n• Intégration directe avec Webflow, HubSpot et LinkedIn.\n• Brand Kit centralisé pour éliminer les incohérences de message.`,
  es: `## Nexus: El sistema operativo de contenido impulsado por IA para B2B\n\nLos equipos de marketing empresarial necesitan acelerar la producción de contenidos sin descuidar la gobernanza de marca.\n\n### Beneficios Clave\n• Aceleración del 65% en tiempos de campaña con cero infracciones de marca.\n• Publicación directa en Webflow, HubSpot y LinkedIn.\n• Brand Kit centralizado para garantizar mensajes verificados.`,
};

export default function LocalizationPage() {
  const { addToast } = useToast();
  const [localizations, setLocalizations] = useState<LocalizationEntry[]>(() => getWorkspaceData().localizations);
  const [selectedLang, setSelectedLang] = useState("de");
  const [adaptationMode, setAdaptationMode] = useState<"cultural" | "literal">("cultural");
  const [sourceText, setSourceText] = useState(
    `# Nexus: The AI-Powered Content Operating System for B2B\n\nModern enterprise marketing teams struggle with content velocity while maintaining strict brand governance.\n\n## Key Benefits\n• 65% faster campaign turnaround without compliance risk.\n• Direct publishing to Webflow, HubSpot, and LinkedIn.\n• Centralized Brand Kit to eliminate unverified claims.`
  );
  const [translatedText, setTranslatedText] = useState(mockTranslations.de);
  const [isTranslating, setIsTranslating] = useState(false);
  const [lockedTerms, setLockedTerms] = useState(["Nexus", "Content Hub", "Brand Kit", "AI Studio", "SOC2"]);
  const [newLockedTerm, setNewLockedTerm] = useState("");

  const [culturalNotes, setCulturalNotes] = useState<string>("");

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    setTranslatedText(mockTranslations[langCode] || mockTranslations.de);
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    const langObj = languages.find(l => l.code === selectedLang) || languages[0];
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          targetLang: langObj.name,
          tone: adaptationMode === "cultural" 
            ? `Cultural enterprise B2B transcreation for ${langObj.region}. Preserve locked terms: ${lockedTerms.join(", ")}`
            : `Direct professional business translation. Preserve locked terms: ${lockedTerms.join(", ")}`,
        }),
      });

      const data = await res.json();
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
        setCulturalNotes(data.culturalNotes || "");
        addToast({
          title: "Localization Complete!",
          message: `Transcreated into ${langObj.name} using Groq AI.`,
          type: "success"
        });
      } else {
        throw new Error(data.error || "Translation failed");
      }
    } catch (err: any) {
      addToast({ title: "Localization Error", message: err.message, type: "error" });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLockedTerm.trim()) return;
    setLockedTerms([...lockedTerms, newLockedTerm.trim()]);
    setNewLockedTerm("");
    addToast({ title: "Term locked in glossary", type: "success" });
  };

  const handleSaveDoc = () => {
    const langObj = languages.find(l => l.code === selectedLang);
    const doc = createDocument(`Localized (${langObj?.name}) - ${sourceText.split("\n")[0].replace(/^#+\s*/, "").slice(0, 30)}`, "Marketing", translatedText);
    addToast({
      title: "Saved Localized Document",
      message: `Created document "${doc.title}" in Marketing workspace.`,
      type: "success"
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Global Transcreation
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Glossary Term Lock Active
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">Localization & Translation Hub</h1>
            <p className="text-slate-500 mt-1 text-base">Adapt marketing collateral across global regions while preserving brand voice and protecting untranslatable trademarks.</p>
          </div>

          <Button 
            onClick={handleTranslate} 
            isLoading={isTranslating}
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isTranslating ? "animate-spin" : ""}`} />
            Run Global Transcreation
          </Button>
        </div>

        {/* Target Languages Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
                    : "bg-white/80 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xl mb-1">{lang.flag}</div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{lang.name}</h4>
                <p className="text-[10px] text-slate-400 font-medium truncate">{lang.region}</p>
              </button>
            );
          })}
        </div>

        {/* Translation Controls Strip */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Adaptation Mode:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdaptationMode("cultural")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adaptationMode === "cultural"
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Cultural Transcreation (Recommended)
              </button>
              <button
                onClick={() => setAdaptationMode("literal")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adaptationMode === "literal"
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Literal Technical
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> 98% Idiomatic Confidence Match
          </div>
        </div>

        {/* Side-by-Side Split Screen Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Source Text (English) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <h3 className="font-heading text-base text-slate-900 font-bold">Source Language: English (US)</h3>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {sourceText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-sans text-sm leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Right: Localized Output */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{languages.find(l => l.code === selectedLang)?.flag}</span>
                  <h3 className="font-heading text-base text-slate-900 font-bold">
                    Target: {languages.find(l => l.code === selectedLang)?.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(translatedText);
                      addToast({ title: "Localized text copied", type: "success" });
                    }}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                  <Button
                    onClick={handleSaveDoc}
                    size="sm"
                    variant="secondary"
                    className="text-xs font-semibold rounded-xl"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Save Doc
                  </Button>
                </div>
              </div>

              <textarea
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 font-sans text-sm leading-relaxed text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
              />

              {culturalNotes && (
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <p><strong className="font-bold">Cultural Transcreation Note:</strong> {culturalNotes}</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Protected Brand Glossary Strip */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <h3 className="font-heading text-base text-slate-900 font-bold">Protected Untranslatable Terms (Glossary)</h3>
            </div>
            <span className="text-xs text-slate-400">These brand names and technical SKUs will never be translated</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {lockedTerms.map((term, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" /> {term}
              </span>
            ))}
          </div>

          <form onSubmit={handleAddTerm} className="flex gap-2 max-w-md pt-2">
            <input
              type="text"
              value={newLockedTerm}
              onChange={(e) => setNewLockedTerm(e.target.value)}
              placeholder="Add protected term (e.g. Enterprise Plus, CRDT)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" size="sm" className="bg-slate-900 text-white rounded-xl text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
