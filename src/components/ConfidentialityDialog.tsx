import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConfidentialityDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
  isAccepting: boolean;
}

export default function ConfidentialityDialog({ open, onAccept, onCancel, isAccepting }: ConfidentialityDialogProps) {
  const [checked, setChecked] = useState(false);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[17px] leading-snug">
            Confidencialidade dos Materiais — Projeto de Conclusão (Blank)
          </AlertDialogTitle>
        </AlertDialogHeader>

        <ScrollArea className="max-h-[55vh] pr-3">
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Ao clicar em "Concordo e acessar", você declara que entendeu e aceita que os materiais do Projeto de
                Conclusão (incluindo estratégias, editorias, posicionamentos, playbooks, documentos, links, prints e
                quaisquer conteúdos de clientes) são <strong className="text-foreground">CONFIDENCIAIS</strong>.
              </p>

              <p className="font-medium text-foreground">Você se compromete a NÃO:</p>

              <ul className="list-disc pl-5 space-y-2">
                <li>Compartilhar links, arquivos, prints, gravações, transcrições ou resumos com terceiros;</li>
                <li>
                  Publicar qualquer parte do material (ou derivados) em redes sociais, portfólio, cases, site, aula,
                  comunidade, palestra ou apresentação externa;
                </li>
                <li>
                  Copiar/armazenar os materiais fora dos ambientes oficiais do projeto, salvo quando exigido para
                  entrega interna;
                </li>
                <li>
                  Inserir em IA (ChatGPT, Claude, Gemini, modelos locais etc.) materiais delicados como editorias e
                  informações estratégicas;
                </li>
                <li>
                  Usar esses materiais para atender clientes próprios/terceiros, vender serviços, criar produtos, aulas
                  ou templates.
                </li>
              </ul>

              <div className="pt-2">
                <p className="font-medium text-foreground">Penalidades</p>
                <p>
                  O descumprimento pode resultar em bloqueio imediato de acesso, remoção do projeto/curso, anulação da
                  certificação e medidas legais cabíveis, incluindo responsabilização por perdas e danos.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </ScrollArea>

        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="agree"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <label htmlFor="agree" className="text-sm leading-snug cursor-pointer select-none">
            Declaro que li e concordo com as regras acima.
          </label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isAccepting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAccept} disabled={!checked || isAccepting}>
            {isAccepting ? "Processando..." : "Concordo e acessar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
