import { useEntrepreneurs, type Entrepreneur } from "@/hooks/useEntrepreneurs";
import { getPhotoByName } from "@/lib/entrepreneurPhotos";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Instagram, Linkedin, Globe, ExternalLink, FileText, ArrowLeft } from "lucide-react";

interface EntrepreneurProfilePageProps {
  entrepreneurId: number;
  onBack: () => void;
}

export default function EntrepreneurProfilePage({ entrepreneurId, onBack }: EntrepreneurProfilePageProps) {
  const { data: entrepreneurs = [], isLoading } = useEntrepreneurs();
  const ent = entrepreneurs.find((e) => e.id === entrepreneurId);

  if (isLoading) {
    return (
      <main className="max-w-[680px] mx-auto px-6 py-20 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground text-sm">Carregando perfil...</p>
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
  const hasLinks = ent.instagram_url || ent.linkedin_url || ent.website_url;
  const bioText = ent.full_bio || ent.bio;

  return (
    <main className="max-w-[680px] mx-auto px-6 pt-12 pb-20">
      {/* Header */}
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

      <Separator className="mb-8" />

      {/* Sobre */}
      <section className="mb-10">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Sobre</p>
        <p className="text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line">{bioText}</p>
      </section>

      {/* Links */}
      {hasLinks ? (
        <section className="mb-10">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Links úteis</p>
          <div className="flex flex-wrap gap-3">
            {ent.instagram_url && (
              <a href={ent.instagram_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-foreground/25 transition-colors text-sm text-foreground">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            )}
            {ent.linkedin_url && (
              <a href={ent.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-foreground/25 transition-colors text-sm text-foreground">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {ent.website_url && (
              <a href={ent.website_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-foreground/25 transition-colors text-sm text-foreground">
                <Globe className="w-4 h-4" /> Site
              </a>
            )}
          </div>
        </section>
      ) : (
        <section className="mb-10">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Links úteis</p>
          <p className="text-sm text-muted-foreground italic">Informações em breve</p>
        </section>
      )}

      {/* Diretrizes de conteúdo */}
      <section className="mb-10">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Diretrizes de conteúdo</p>
        {ent.content_guidelines ? (
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-[14px] text-foreground/80 leading-relaxed whitespace-pre-line">{ent.content_guidelines}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Informações em breve</p>
        )}
      </section>

      {/* Referências */}
      <section className="mb-10">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">Referências de conteúdo</p>
        {ent.content_examples && ent.content_examples.length > 0 ? (
          <div className="space-y-2">
            {ent.content_examples.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-card hover:border-foreground/25 transition-colors text-sm text-foreground group">
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="truncate">{url}</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Informações em breve</p>
        )}
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
    </main>
  );
}
