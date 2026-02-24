import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminList, useAdminMutation } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Save, X, LogOut } from "lucide-react";
import { toast } from "sonner";

const TABLE_COLUMNS: Record<string, string[]> = {
  entrepreneurs: ["name", "company", "segment", "bio", "avatar", "slots", "taken"],
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
      <Tabs defaultValue="entrepreneurs">
        <TabsList className="flex-wrap">
          {TABLES.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t.replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABLES.map((t) => (
          <TabsContent key={t} value={t}>
            <AdminTable table={t} password={password!} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
