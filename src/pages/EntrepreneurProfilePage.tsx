import { useEntrepreneurs } from "@/hooks/useEntrepreneurs";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { getPhotoByName } from "@/lib/entrepreneurPhotos";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

interface EntrepreneurProfilePageProps {
  entrepreneurId: number;
  onBack: () => void;
}

function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s)]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-primary/80 break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function ProfileSection({ label, content, withLinks = false }: { label: string; content?: string | null; withLinks?: boolean }) {
  return (
    <section className="mb-10">
      <p className="font-sans text-[13px] tracking-[0.2em] uppercase text-muted-foreground mb-4">{label}</p>
      {content ? (
        <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line">
          {withLinks ? renderTextWithLinks(content) : content}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground italic">Informações em breve</p>
      )}
    </section>
  );
}

export default function EntrepreneurProfilePage({ entrepreneurId, onBack }: EntrepreneurProfilePageProps) {
  const { data: entrepreneurs, isLoading: loadingEnt } = useEntrepreneurs();

  const ent = entrepreneurs?.find((e) => e.id === entrepreneurId);

  if (loadingEnt) {
    return (
      <main className="max-w-[680px] mx-auto px-6 pt-12 pb-20">
        <Skeleton className="h-20 w-full rounded-2xl mb-10" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </main>
    );
  }

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
      <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground text-sm mb-10 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar ao início
      </button>

      <div className="flex items-start gap-6 mb-10">
        {photo ? (
          <img src={photo} alt={ent.name} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-2xl border border-border bg-foreground/5 flex items-center justify-center font-sans text-xl font-bold text-foreground flex-shrink-0">{ent.avatar}</div>
        )}
        <div>
          <h1 className="text-[28px] font-normal tracking-tight text-foreground leading-tight">{ent.name}</h1>
          <p className="text-[15px] text-foreground font-medium mt-1">{ent.company}</p>
          <Badge variant="outline" className="mt-2">{ent.segment}</Badge>
        </div>
      </div>

      <section className="mb-8">
        <p className="font-sans text-[13px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Links úteis</p>
        <p className="text-sm text-muted-foreground italic">Informações em breve</p>
      </section>

      <Separator className="mb-8" />

      <ProfileSection label="História" content={ent.bio} />
      <ProfileSection label="Posicionamento" content={(ent as any).posicionamento} />
      <ProfileSection label="Tom de voz" content={(ent as any).tom_de_voz} />
      <ProfileSection label="Editorias" content={(ent as any).editorias} />
      <ProfileSection label="Materiais extras" content={(ent as any).materiais_extras} withLinks />

      <Separator className="mb-8" />

      <div className="text-center">
        <p className="text-[13px] text-muted-foreground mb-4">Fique atento ao prazo de entrega. O cronograma completo está disponível na página inicial.</p>
        <Button onClick={onBack} variant="outline" className="rounded-xl">Voltar ao início</Button>
      </div>
    </main>
  );
}
