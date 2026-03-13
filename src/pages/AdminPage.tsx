import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminList, useAdminMutation } from "@/hooks/useAdminData";
import { ProfileSection, renderTextWithLinks } from "@/pages/EntrepreneurProfilePage";
import { getPhotoByName } from "@/lib/entrepreneurPhotos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Save, X, LogOut, ArrowLeft, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const TABLE_COLUMNS: Record<string, string[]> = {
  entrepreneurs: ["name", "company", "segment", "bio", "avatar", "slots", "taken", "posicionamento", "tom_de_voz", "editorias", "materiais_extras"],
  calendar_events: ["date", "day", "title", "description", "is_active", "sort_order"],
  flow_steps: ["step_number", "title", "description", "sort_order"],
  rules: ["text", "sort_order"],
  selections: ["user_email", "entrepreneur_id", "created_at"],
  
};

const TABLES = Object.keys(TABLE_COLUMNS);

function AdminLogin({ onLogin, isVerifying, error }: {
  onLogin: (pwd: string) => void;
  isVerifying: boolean;
  error: string | null;
}) {
  const [pwd, setPwd] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Senha"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onLogin(pwd)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" onClick={() => onLogin(pwd)} disabled={isVerifying}>
            {isVerifying ? "Verificando..." : "Entrar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminTable({ table, password }: { table: string; password: string }) {
  const columns = TABLE_COLUMNS[table];
  const { data: rows, isLoading } = useAdminList(table, password);
  const { insert, update, remove } = useAdminMutation(table, password);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState<Record<string, string>>({});
  const isReadOnly = table === "selections";

  const startEdit = (row: Record<string, unknown>) => {
    setEditingId(row.id as number);
    setEditData({ ...row });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    try {
      const payload: Record<string, unknown> = {};
      columns.forEach((col) => {
        if (editData[col] !== undefined) payload[col] = editData[col];
      });
      await update.mutateAsync({ id: editingId!, data: payload });
      toast.success("Atualizado");
      cancelEdit();
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Deletado");
    } catch {
      toast.error("Erro ao deletar");
    }
  };

  const handleAdd = async () => {
    try {
      const payload: Record<string, unknown> = {};
      columns.forEach((col) => {
        const val = newData[col];
        if (val === undefined || val === "") return;
        if (col === "is_active") payload[col] = val === "true";
        else if (["slots", "taken", "sort_order", "entrepreneur_id"].includes(col))
          payload[col] = Number(val);
        else payload[col] = val;
      });
      await insert.mutateAsync(payload);
      toast.success("Adicionado");
      setAdding(false);
      setNewData({});
    } catch {
      toast.error("Erro ao adicionar");
    }
  };

  if (isLoading) return <p className="p-4 text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <Button size="sm" variant="outline" onClick={() => setAdding(!adding)}>
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      )}
      <div className="overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>id</TableHead>
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
              {!isReadOnly && <TableHead>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {adding && (
              <TableRow>
                <TableCell>-</TableCell>
                {columns.map((col) => (
                  <TableCell key={col}>
                    <Input
                      className="min-w-[100px]"
                      value={newData[col] || ""}
                      onChange={(e) => setNewData({ ...newData, [col]: e.target.value })}
                      placeholder={col}
                    />
                  </TableCell>
                ))}
                <TableCell className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={handleAdd}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setAdding(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {(rows as Record<string, unknown>[])?.map((row) => (
              <TableRow key={row.id as number}>
                <TableCell>{String(row.id)}</TableCell>
                {columns.map((col) => (
                  <TableCell key={col}>
                    {editingId === row.id ? (
                      <Input
                        className="min-w-[100px]"
                        value={String(editData[col] ?? "")}
                        onChange={(e) =>
                          setEditData({ ...editData, [col]: e.target.value })
                        }
                      />
                    ) : (
                      <span className="max-w-[200px] truncate block">
                        {String(row[col] ?? "")}
                      </span>
                    )}
                  </TableCell>
                ))}
                {!isReadOnly && (
                  <TableCell>
                    <div className="flex gap-1">
                      {editingId === row.id ? (
                        <>
                          <Button size="icon" variant="ghost" onClick={saveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => startEdit(row)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(row.id as number)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function AdminProfiles({ password }: { password: string }) {
  const { data: rows, isLoading } = useAdminList("entrepreneurs", password);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isLoading) return <p className="p-4 text-muted-foreground">Carregando...</p>;

  const entrepreneurs = (rows as Record<string, unknown>[]) || [];
  const selected = selectedId !== null ? entrepreneurs.find((e) => e.id === selectedId) : null;

  if (selected) {
    const photo = getPhotoByName(String(selected.name));
    return (
      <div className="max-w-[720px] mx-auto">
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-1.5 text-muted-foreground text-sm mb-8 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar à lista
        </button>
        <div className="flex items-start gap-5 mb-8">
          {photo ? (
            <img src={photo} alt={String(selected.name)} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl border border-border bg-foreground/5 flex items-center justify-center font-sans text-lg font-bold text-foreground flex-shrink-0">{String(selected.avatar)}</div>
          )}
          <div>
            <h2 className="text-xl font-medium text-foreground">{String(selected.name)}</h2>
            <p className="text-sm text-foreground/70">{String(selected.company)}</p>
            <Badge variant="outline" className="mt-1">{String(selected.segment)}</Badge>
          </div>
        </div>
        <Separator className="mb-8" />
        <ProfileSection label="História" content={selected.bio as string} />
        <ProfileSection label="Posicionamento" content={selected.posicionamento as string} />
        <ProfileSection label="Tom de voz" content={selected.tom_de_voz as string} />
        <ProfileSection label="Editorias" content={selected.editorias as string} />
        <ProfileSection label="Materiais extras" content={selected.materiais_extras as string} withLinks />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {entrepreneurs.map((ent) => {
        const photo = getPhotoByName(String(ent.name));
        return (
          <Card key={ent.id as number} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedId(ent.id as number)}>
            <CardContent className="p-4 flex items-center gap-4">
              {photo ? (
                <img src={photo} alt={String(ent.name)} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl border border-border bg-foreground/5 flex items-center justify-center font-sans text-sm font-bold text-foreground flex-shrink-0">{String(ent.avatar)}</div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{String(ent.name)}</p>
                <p className="text-sm text-muted-foreground truncate">{String(ent.company)}</p>
                <Badge variant="outline" className="mt-1 text-xs">{String(ent.segment)}</Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function AdminSubmissions({ password }: { password: string }) {
  const { data: submissions, isLoading } = useAdminList("submissions", password);
  const { data: entrepreneurs } = useAdminList("entrepreneurs", password);

  if (isLoading) return <p className="p-4 text-muted-foreground">Carregando...</p>;

  const entMap = new Map<number, string>();
  ((entrepreneurs as Record<string, unknown>[]) || []).forEach((e) => {
    entMap.set(e.id as number, String(e.name));
  });

  const rows = (submissions as Record<string, unknown>[]) || [];

  return (
    <div className="overflow-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Empresário</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id as number}>
              <TableCell>{String(row.user_email ?? "")}</TableCell>
              <TableCell>{entMap.get(row.entrepreneur_id as number) ?? String(row.entrepreneur_id)}</TableCell>
              <TableCell>
                {row.link ? (
                  <a href={String(row.link)} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate block max-w-[200px]">
                    {String(row.link)}
                  </a>
                ) : "-"}
              </TableCell>
              <TableCell>
                {row.file_url ? (
                  <a href={String(row.file_url)} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate block max-w-[200px]">
                    {String(row.file_name || "Download")}
                  </a>
                ) : "-"}
              </TableCell>
              <TableCell>
                <span className="max-w-[200px] truncate block">{String(row.observations ?? "-")}</span>
              </TableCell>
              <TableCell>{row.created_at ? new Date(String(row.created_at)).toLocaleDateString("pt-BR") : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, password, verify, logout, isVerifying, error } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={verify} isVerifying={isVerifying} error={error} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-1" /> Sair
        </Button>
      </div>
      <Tabs defaultValue="profiles">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profiles">Perfis</TabsTrigger>
          <TabsTrigger value="submissoes">Submissões</TabsTrigger>
          {TABLES.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t.replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profiles">
          <AdminProfiles password={password!} />
        </TabsContent>
        <TabsContent value="submissoes">
          <AdminSubmissions password={password!} />
        </TabsContent>
        {TABLES.map((t) => (
          <TabsContent key={t} value={t}>
            <AdminTable table={t} password={password!} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
