import { ENTREPRENEURS, CALENDAR_EVENTS } from "@/data/entrepreneurs";
import { getPhotoByName } from "@/lib/entrepreneurPhotos";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock } from "lucide-react";

interface EntrepreneurProfilePageProps {
  entrepreneurId: number;
  onBack: () => void;
}

export default function EntrepreneurProfilePage({ entrepreneurId, onBack }: EntrepreneurProfilePageProps) {
  const ent = ENTREPRENEURS.find((e) => e.id === entrepreneurId);
  const selectionDate = CALENDAR_EVENTS.length >= 2 ? CALENDAR_EVENTS[1].date : "em breve";

  if (!ent) {
    return (
      <main className="max-w-[680px] mx-auto px-6 py-20 text-center min-h-[60vh]">
        <p className="text-muted-foreground text-sm">Empresário não encontrado.</p>
        <Button onClick={onBack} variant="outline" className="mt-6 rounded-xl">Voltar ao início</Button>
      </main>
    );
  }

  const photo = getPhotoByName(ent.name);

  return (
    <main className="max-w-[680px] mx-auto px-6 pt-12 pb-20">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-muted-foreground text-sm mb-10 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </button>

      <div className="flex items-start gap-6 mb-10">
        {photo ? (
          <img src={photo} alt={ent.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-2xl border border-border bg-foreground/5 flex items-center justify-center font-sans text-xl font-bold text-foreground flex-shrink-0">
            {ent.avatar}
          </div>
        )}
        <div>
          <h1 className="text-[28px] font-normal tracking-tight text-foreground leading-tight">{ent.name}</h1>
          <p className="text-[15px] text-foreground font-medium mt-1">{ent.company}</p>
          <Badge variant="outline" className="mt-2">{ent.segment}</Badge>
        </div>
      </div>

      <section className="mb-8">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Links úteis</p>
        <p className="text-sm text-muted-foreground italic">Informações em breve</p>
      </section>

      <Separator className="mb-8" />

      {/* Blurred content */}
      <div className="relative">
        <div className="blur-[8px] select-none pointer-events-none">
          <section className="mb-10">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Sobre</p>
            <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line">{ent.bio}</p>
          </section>

          <section className="mb-10">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Diretrizes de conteúdo</p>
            <p className="text-sm text-muted-foreground italic">Informações em breve</p>
          </section>

          <section className="mb-10">
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Referências de conteúdo</p>
            <p className="text-sm text-muted-foreground italic">Informações em breve</p>
          </section>

          <Separator className="mb-8" />

          <div className="text-center">
            <p className="text-[13px] text-muted-foreground mb-4">
              Fique atento ao prazo de entrega. O cronograma completo está disponível na página inicial.
            </p>
            <Button onClick={onBack} variant="outline" className="rounded-xl">
              Voltar ao início
            </Button>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border shadow-lg">
            <Lock className="w-6 h-6 text-muted-foreground" />
            <p className="text-sm text-foreground font-medium text-center">
              Liberaremos todo o material completo após o período de seleção no dia {selectionDate}.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
