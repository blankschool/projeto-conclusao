import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface AuthPageProps {
  onAuth: (email: string, existingEntrepreneurId?: number) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [studentInfo, setStudentInfo] = useState<{ name: string; email: string; phone: string } | null>(null);

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
      const inputEmail = email.trim().toLowerCase();
      let found = false;
      for (const row of rows) {
        const cols = row.split(",");
        const rowEmail = cols[2]?.trim().toLowerCase().replace(/"/g, "");
        if (rowEmail === inputEmail) {
          found = true;
          setStudentInfo({
            name: cols[1]?.trim().replace(/"/g, "") || "",
            email: cols[2]?.trim().replace(/"/g, "") || "",
            phone: cols[3]?.trim().replace(/"/g, "") || "",
          });
          break;
        }
      }
      if (found) {
        setStatus("success");

        // Check if user already selected an entrepreneur
        const { data: existing } = await supabase
          .from("selections")
          .select("entrepreneur_id")
          .eq("user_email", inputEmail)
          .maybeSingle();

        setTimeout(() => onAuth(email, existing?.entrepreneur_id ?? undefined), 1500);
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
      <h2 className="text-[28px] font-normal text-center tracking-tight text-foreground">Acesse a plataforma</h2>
      <p className="text-sm text-muted-foreground mt-2.5 mb-10 text-center leading-relaxed">
        Insira o e-mail cadastrado na Blank para verificarmos sua matrícula.
      </p>

      <div className="w-full mb-4">
        <Label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Seu e-mail</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="aluno@email.com"
          className={`h-14 px-5 text-[15px] rounded-xl border ${status === "error" ? "border-destructive/40" : "border-input"}`}
        />
      </div>

      {status === "error" && (
        <div className="w-full px-4 py-3 rounded-lg bg-destructive/8 border border-destructive/15 text-[13px] text-destructive mb-4">{errorMsg}</div>
      )}

      {status === "success" && studentInfo && (
        <div className="w-full px-5 py-4 rounded-xl bg-primary/8 border border-primary/15 mb-4 space-y-2">
          <p className="text-[15px] font-medium text-foreground">Bem-vindo(a)!</p>
          <div className="text-[13px] text-muted-foreground space-y-1">
            <p><span className="text-foreground/70">Nome:</span> {studentInfo.name}</p>
            <p><span className="text-foreground/70">E-mail:</span> {studentInfo.email}</p>
            <p><span className="text-foreground/70">Telefone:</span> {studentInfo.phone}</p>
          </div>
          <p className="text-[12px] text-muted-foreground pt-1">Redirecionando...</p>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={status === "loading" || status === "success"} className="w-full mt-2 h-12 rounded-xl text-sm">
        {status === "loading" ? "Verificando..." : status === "success" ? "Verificado ✓" : "Verificar e-mail"}
      </Button>

      <p className="text-xs text-muted-foreground mt-6 text-center leading-relaxed">
        Caso não consiga acessar,{" "}
        <a href="https://wa.me/5512982115609?text=Quero%20ajuda%20com%20a%20plataforma%20do%20Projeto%20de%20Conclus%C3%A3o." target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80 transition-colors">fale com o suporte</a>{" "}
        da Blank.
      </p>
    </main>
  );
}
