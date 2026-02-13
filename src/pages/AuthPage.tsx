import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthPageProps {
  onAuth: (email: string) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMsg("Insira um e-mail válido.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcrRsRetEFdFk7tlIFgBLmRprPY5Z5vsZiTbRzgKgqIV-5N2SnTPSQivGyvW3Me2rCMBIQ-4Fy45ei/pub?gid=1657701443&single=true&output=csv"
      );
      const csv = await res.text();
      const rows = csv.split("\n").slice(1);
      const emails = rows
        .map((row) => {
          const cols = row.split(",");
          return cols[2]?.trim().toLowerCase().replace(/"/g, "");
        })
        .filter(Boolean);
      const inputEmail = email.trim().toLowerCase();
      if (emails.includes(inputEmail)) {
        setStatus("success");
        setTimeout(() => onAuth(email), 800);
      } else {
        setStatus("error");
        setErrorMsg("E-mail não encontrado na base de alunos.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Erro ao verificar e-mail. Tente novamente.");
    }
  };

  return (
    <main className="max-w-[480px] mx-auto px-6 py-20 flex flex-col items-center min-h-[80vh] justify-center">
      <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center mb-8">
        <span className="text-3xl text-background">✦</span>
      </div>

      <h2 className="text-[28px] font-normal text-center tracking-tight text-foreground">
        Acesse a plataforma
      </h2>
      <p className="text-sm text-muted-foreground mt-2.5 mb-10 text-center leading-relaxed">
        Insira o e-mail cadastrado na Blank para verificarmos sua matrícula.
      </p>

      <div className="w-full mb-4">
        <Label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
          Seu e-mail
        </Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="aluno@email.com"
          className={`h-14 px-5 text-[15px] rounded-xl border ${
            status === "error" ? "border-destructive/40" : "border-input"
          }`}
        />
      </div>

      {status === "error" && (
        <div className="w-full px-4 py-3 rounded-lg bg-destructive/8 border border-destructive/15 text-[13px] text-destructive mb-4">
          {errorMsg}
        </div>
      )}

      {status === "success" && (
        <div className="w-full px-4 py-3 rounded-lg bg-primary/8 border border-primary/15 text-[13px] text-foreground mb-4">
          ✓ E-mail verificado. Redirecionando...
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={status === "loading" || status === "success"}
        className="w-full mt-2 h-12 rounded-xl text-sm"
      >
        {status === "loading" ? "Verificando..." : status === "success" ? "Verificado ✓" : "Verificar e-mail"}
      </Button>

      <p className="text-xs text-muted-foreground mt-6 text-center leading-relaxed">
        Caso não consiga acessar, entre em contato com o suporte da Blank.
      </p>
    </main>
  );
}
