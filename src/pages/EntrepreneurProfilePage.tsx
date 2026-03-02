import { useState, useRef } from "react";
import { useEntrepreneurs } from "@/hooks/useEntrepreneurs";
import { useCreateSubmission } from "@/hooks/useCreateSubmission";
import { getPhotoByName } from "@/lib/entrepreneurPhotos";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EntrepreneurProfilePageProps {
  entrepreneurId: number;
  userEmail: string;
  onBack: () => void;
}

export function renderTextWithLinks(text: string) {
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

export function ProfileSection({ label, content, withLinks = false }: { label: string; content?: string | null; withLinks?: boolean }) {
  return (
    <section className="mb-10">
      <p className="font-sans text-[15px] tracking-[0.18em] uppercase text-muted-foreground mb-4 font-medium">{label}</p>
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

export default function EntrepreneurProfilePage({ entrepreneurId, userEmail, onBack }: EntrepreneurProfilePageProps) {
  const { data: entrepreneurs, isLoading: loadingEnt } = useEntrepreneurs();
  const submission = useCreateSubmission();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [observations, setObservations] = useState("");
  const [submitted, setSubmitted] = useState(false);
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


      <ProfileSection label="História" content={ent.bio} />
      <ProfileSection label="Posicionamento" content={(ent as any).posicionamento} />
      <ProfileSection label="Tom de voz" content={(ent as any).tom_de_voz} />
      <ProfileSection label="Editorias" content={(ent as any).editorias} />
      <ProfileSection label="Materiais extras" content={(ent as any).materiais_extras} withLinks />

      <Separator className="mb-8" />

      {/* Submission form */}
      {submitted ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-[15px] font-medium text-foreground mb-1">Conteúdo enviado com sucesso!</p>
          <p className="text-[13px] text-muted-foreground mb-6">Você pode enviar novamente se precisar.</p>
          <Button variant="outline" className="rounded-xl" onClick={() => { setSubmitted(false); setLink(""); setFile(null); setObservations(""); }}>Enviar outro conteúdo</Button>
        </div>
      ) : (
        <section className="mb-10">
          <p className="font-sans text-[15px] tracking-[0.18em] uppercase text-muted-foreground mb-6 font-medium">Enviar conteúdo</p>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="link">Link do conteúdo</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Arquivo</Label>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 border border-input rounded-xl px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {file ? file.name : "Selecionar arquivo"}
                </span>
              </div>
              {file && (
                <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-xs text-muted-foreground underline">
                  Remover arquivo
                </button>
              )}
            </div>

            <p className="text-[12px] text-muted-foreground">Preencha pelo menos o link ou o arquivo.</p>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações (opcional)</Label>
              <Textarea
                id="observations"
                placeholder="Alguma observação sobre o conteúdo..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="rounded-xl"
                rows={3}
              />
            </div>

            <Button
              className="w-full rounded-xl"
              disabled={(!link && !file) || submission.isPending}
              onClick={() => {
                submission.mutate(
                  { entrepreneurId, userEmail, link: link || undefined, file: file || undefined, observations: observations || undefined },
                  {
                    onSuccess: () => {
                      setSubmitted(true);
                      toast({ title: "Conteúdo enviado!", description: "Seu conteúdo foi registrado com sucesso." });
                    },
                    onError: () => {
                      toast({ title: "Erro ao enviar", description: "Tente novamente em alguns instantes.", variant: "destructive" });
                    },
                  }
                );
              }}
            >
              {submission.isPending ? "Enviando..." : "Enviar conteúdo"}
            </Button>
          </div>
        </section>
      )}

      <Separator className="mb-8" />

      <div className="text-center">
        <p className="text-[13px] text-muted-foreground mb-4">Fique atento ao prazo de entrega. O cronograma completo está disponível na página inicial.</p>
        <Button onClick={onBack} variant="outline" className="rounded-xl">Voltar ao início</Button>
      </div>
    </main>
  );
}
