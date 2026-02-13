import { useFlowSteps } from "@/hooks/useFlowSteps";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useRules } from "@/hooks/useRules";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ExplanationPageProps {
  onStart: () => void;
}

export default function ExplanationPage({ onStart }: ExplanationPageProps) {
  const { data: flowSteps = [], isLoading: loadingSteps } = useFlowSteps();
  const { data: calendarEvents = [], isLoading: loadingEvents } = useCalendarEvents();
  const { data: rules = [], isLoading: loadingRules } = useRules();

  const isLoading = loadingSteps || loadingEvents || loadingRules;

  if (isLoading) {
    return (
      <main className="max-w-[880px] mx-auto px-6 pt-12 pb-20 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-sm">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="max-w-[880px] mx-auto px-6 pt-12 pb-20">
      {/* Header */}
      <header className="mb-14">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
          Projeto de conclusão — turma 2026.1
        </p>
        <h1 className="text-[clamp(30px,5vw,48px)] font-normal leading-[1.1] tracking-tight text-foreground">
          Crie conteúdo real<br />para clientes <span className="text-foreground italic">Blank</span>
        </h1>
        <p className="text-base text-muted-foreground mt-4 max-w-[520px] leading-relaxed">
          Seu projeto de conclusão é produzir conteúdo para um empresário real da carteira Blank.
          Os melhores trabalhos serão publicados no perfil oficial do cliente.
        </p>
      </header>

      {/* Flow steps */}
      <section className="flex gap-1 mb-14 flex-wrap">
        {flowSteps.map((s) => (
          <div
            key={s.id}
            className="flex-1 min-w-[150px] p-5 rounded-xl border border-border bg-card/50"
          >
            <div className="font-serif text-2xl font-normal text-foreground mb-2">{s.step_number}</div>
            <div className="text-sm font-semibold mb-1 text-foreground">{s.title}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{s.description}</div>
          </div>
        ))}
      </section>

      {/* Calendar */}
      <section className="mb-14">
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-5">
          Calendário
        </p>
        <div className="flex flex-col gap-0.5">
          {calendarEvents.map((ev) => (
            <div
              key={ev.id}
              className={`grid grid-cols-[90px_1fr_auto] gap-5 items-center px-6 py-4 rounded-xl border transition-colors ${
                ev.is_active
                  ? "bg-primary/5 border-primary/20"
                  : "bg-transparent border-border/30"
              }`}
            >
              <div>
                <div className={`font-sans text-sm font-bold ${ev.is_active ? "text-foreground" : "text-muted-foreground"}`}>
                  {ev.date}
                </div>
                <div className="font-sans text-[10px] text-muted-foreground mt-0.5">{ev.day}</div>
              </div>
              <div>
                <div className={`text-sm font-medium mb-0.5 ${ev.is_active ? "text-foreground" : "text-muted-foreground"}`}>
                  {ev.title}
                </div>
                <div className="text-xs text-muted-foreground">{ev.description}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${ev.is_active ? "bg-foreground" : "bg-border"}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="p-7 rounded-2xl border border-border bg-card/30 mb-12">
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-4">
          Regras importantes
        </p>
        <div className="grid gap-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-start gap-3">
              <ArrowRight className="w-3 h-3 mt-1 text-foreground flex-shrink-0" />
              <p className="text-[13px] text-muted-foreground leading-relaxed">{rule.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <Button onClick={onStart} size="lg" className="px-12 py-6 text-[15px] rounded-xl">
          Começar agora
        </Button>
      </div>
    </main>
  );
}
