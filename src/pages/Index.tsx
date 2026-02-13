import { useState } from "react";
import ExplanationPage from "./ExplanationPage";
import AuthPage from "./AuthPage";
import SelectionPage from "./SelectionPage";

type Page = "explanation" | "auth" | "selection";

const Index = () => {
  const [page, setPage] = useState<Page>("explanation");
  const [userEmail, setUserEmail] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 max-w-[880px] mx-auto border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <img
          src="/blank-logo.svg"
          alt="Blank"
          className="h-6 cursor-pointer"
          onClick={() => { setPage("explanation"); setUserEmail(""); }}
        />
        <div className="flex gap-1">
          {(["explanation", "auth", "selection"] as Page[]).map((p) => (
            <div
              key={p}
              className={`w-6 h-[3px] rounded-sm transition-colors ${
                page === p ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>
      </nav>

      {/* Pages */}
      {page === "explanation" && <ExplanationPage onStart={() => setPage("auth")} />}
      {page === "auth" && <AuthPage onAuth={(email) => { setUserEmail(email); setPage("selection"); }} />}
      {page === "selection" && <SelectionPage userEmail={userEmail} onBack={() => { setPage("explanation"); setUserEmail(""); }} />}

      {/* Footer */}
      <footer className="text-center py-6 font-sans text-[10px] tracking-[0.2em] uppercase text-border">
        Blank © 2026
      </footer>
    </div>
  );
};

export default Index;
