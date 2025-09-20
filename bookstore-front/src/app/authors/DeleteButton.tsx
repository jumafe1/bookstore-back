"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAuthor } from "@/lib/api";

export default function DeleteButton({ id }: Readonly<{ id: number }>) {
  const [pending, start] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("¿Eliminar autor?")) return;
    try {
      await deleteAuthor(id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      alert(`Error eliminando: ${msg}`);
      return;
    }
    router.refresh(); // recarga lista
  }

  return (
    <button
      disabled={pending}
      onClick={() => start(handleDelete)}
      className="text-red-600 underline"
    >
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
