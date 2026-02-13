import { useState } from "react";
import { useEntrepreneurs, useCreateSelection } from "@/hooks/useEntrepreneurs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";

interface SelectionPageProps {
  userEmail: string;
  onBack: () => void;
}

export default function SelectionPage({ userEmail, onBack }: SelectionPageProps) {
  const { data: entrepreneurs = [], isLoading } = useEntrepreneurs();
  const createSelection = useCreateSelection();
  const [popup, setPopup] = useState<number | null>(null);
  const [step, setStep] = useState<"info" | "preconfirm" | "confirmed">("info");
  const [confirmedEnt, setConfirmedEnt] = useState<{ name: string; company: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClosePopup = () => { setPopup(null); setStep("info"); };
  const handlePreConfirm = () => setStep("preconfirm");

  const handleConfirm = async () => {
    if (popup === null) return;
    const ent = entrepreneurs[popup];
    setSubmitting(true);
    try {
      await createSelection(userEmail, ent.id);
      setConfirmedEnt({ name: ent.name, company: ent.company });
      setStep("confirmed");
    } catch (err: any) {
      if (err?.code === "23505") {
        toast.error("Você já está inscrito em um empresário.");
      } else {
        toast.error("Erro ao confirmar inscrição. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (step === "confirmed" && confirmedEnt) {
    return (
      <main className="max-w-[520px] mx-auto px-6 py-20 flex flex-col items-center min-h-[80vh] justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-foreground flex items-center justify-center mb-8">
          <Check className="w-9 h-9 text-background" />
        </div>
        <h2 className="text-[28px] font-normal tracking-tight text-foreground">Inscrição confirmada</h2>
        <p className="text-[15px] text-muted-foreground mt-3 leading-relaxed">
          Você está inscrito para criar conteúdo para <strong className="text-foreground">{confirmedEnt.name}</strong> da <strong className="text-foreground">{confirmedEnt.company}</strong>.
        </p>
        <p className="text-[13px] text-muted-foreground mt-6 leading-relaxed">
          Fique atento ao prazo de entrega. O cronograma completo está disponível na página inicial.
        </p>
        <Button onClick={onBack} variant="outline" className="mt-8 rounded-xl">
          Voltar ao início
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="max-w-[880px] mx-auto px-6 pt-12 pb-20 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-sm">Carregando empresários...</p>
      </main>
    );
  }

  const selectedEnt = popup !== null ? entrepreneurs[popup] : null;

  return (
    <main className="max-w-[880px] mx-auto px-6 pt-12 pb-20 relative">
      <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
        <div>
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Etapa 2 — seleção
          </p>
          <h2 className="text-[clamp(24px,4vw,36px)] font-normal tracking-tight text-foreground">
            Escolha seu empresário
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Selecione um dos clientes Blank para produzir conteúdo.</p>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          {userEmail}
        </Badge>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
        {entrepreneurs.map((ent, i) => {
          const full = ent.taken >= ent.slots;
          const remaining = ent.slots - ent.taken;
          return (
            <div
              key={ent.id}
              onClick={() => { if (!full) { setPopup(i); setStep("info"); } }}
              className={`p-7 rounded-2xl border transition-all relative overflow-hidden ${
                full
                  ? "bg-card/30 border-border/30 cursor-not-allowed opacity-45"
                  : "bg-card border-border cursor-pointer hover:border-foreground/25"
              }`}
            >
              {full && (
                <span className="absolute top-4 right-4 font-sans text-[9px] tracking-wider uppercase text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                  Esgotado
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl border border-border flex items-center justify-center font-sans text-sm font-bold mb-5 ${
                full ? "bg-muted text-muted-foreground" : "bg-foreground/5 text-foreground"
              }`}>
                {ent.avatar}
              </div>
              <div className="text-[17px] font-serif font-normal mb-1 text-foreground">{ent.name}</div>
              <div className="text-[13px] text-foreground font-medium mb-3">{ent.company}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-4">{ent.segment}</div>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {Array.from({ length: ent.slots }).map((_, j) => (
                    <div
                      key={j}
                      className={`w-2 h-2 rounded-full transition-all ${
                        j < ent.taken ? "bg-border" : "bg-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-sans text-[10px] text-muted-foreground">
                  {full ? "0 vagas" : `${remaining} ${remaining === 1 ? "vaga" : "vagas"}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail / Confirm Dialog */}
      <Dialog open={popup !== null && step !== "confirmed"} onOpenChange={(open) => { if (!open) handleClosePopup(); }}>
        <DialogContent className="rounded-2xl max-w-md">
          {selectedEnt && step === "info" && (
            <>
              <DialogHeader>
                <div className="w-14 h-14 rounded-2xl border border-border bg-foreground/5 flex items-center justify-center font-sans text-base font-bold text-foreground mb-4">
                  {selectedEnt.avatar}
                </div>
                <DialogTitle className="text-[22px] font-normal tracking-tight">{selectedEnt.name}</DialogTitle>
                <div className="text-sm text-foreground font-medium">{selectedEnt.company}</div>
                <Badge variant="outline" className="w-fit mt-1">{selectedEnt.segment}</Badge>
              </DialogHeader>

              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                {selectedEnt.bio}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div>
                  <div className="font-sans text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Vagas totais</div>
                  <div className="text-xl font-serif text-foreground">{selectedEnt.slots}</div>
                </div>
                <div>
                  <div className="font-sans text-[10px] tracking-wider uppercase text-muted-foreground mb-1">Disponíveis</div>
                  <div className="text-xl font-serif text-foreground">{selectedEnt.slots - selectedEnt.taken}</div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                <Button onClick={handleClosePopup} variant="outline" className="flex-1 rounded-xl">Voltar</Button>
                <Button onClick={handlePreConfirm} className="flex-[2] rounded-xl">Quero me inscrever</Button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-3">
                Você ainda poderá revisar antes de confirmar.
              </p>
            </>
          )}

          {selectedEnt && step === "preconfirm" && (
            <>
              <DialogHeader className="items-center">
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7 text-destructive" />
                </div>
                <DialogTitle className="text-xl font-normal text-center">Tem certeza?</DialogTitle>
                <DialogDescription className="text-center leading-relaxed">
                  Ao confirmar, você será inscrito para produzir conteúdo para <strong className="text-foreground">{selectedEnt.name}</strong> da <strong className="text-foreground">{selectedEnt.company}</strong>.
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 mt-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-destructive text-xs font-bold mt-0.5">!</span>
                  <p className="text-[13px] text-destructive/80 leading-relaxed">
                    Essa ação é irreversível. Após confirmar, não será possível trocar de empresário.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 mt-5">
                <Button onClick={() => setStep("info")} variant="outline" className="flex-1 rounded-xl">Voltar</Button>
                <Button onClick={handleConfirm} disabled={submitting} className="flex-[2] rounded-xl">
                  {submitting ? "Confirmando..." : "Sim, confirmar inscrição"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
