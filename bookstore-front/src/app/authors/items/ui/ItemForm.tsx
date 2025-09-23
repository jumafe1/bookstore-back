"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const API = "https://rickandmortyapi.com/api";

export type Episode = {
  id: number;
  name: string;        
  air_date: string;    
  episode: string;     
  characters: string[]; 
};

const FormSchema = z.object({
  title: z.string().min(6, "Mínimo 6 caracteres"),
  characters: z
    .string()
    .regex(/^\d+-\d+-\d+-\d+-\d+$/, "Formato: d-d-d-d-d (solo números y guiones)"),
});
export type ItemFormValues = z.infer<typeof FormSchema>;

export default function ItemForm({
  defaultValues,
  onSubmit,
  submitLabel = "Guardar",
}: {
  defaultValues?: Partial<ItemFormValues>;
  onSubmit: (ep: Episode) => Promise<void> | void;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: { title: "", characters: "", ...defaultValues },
  });

  async function submit(values: ItemFormValues) {
    const ids = values.characters.trim().split("-").map((n) => Number(n.trim()));
    const ep: Episode = {
      id: Date.now(),
      name: values.title.trim(),
      air_date: new Date().toISOString().slice(0, 10),
      episode: "S00E00",
      characters: ids.map((id) => `${API}/character/${id}`),
    };
    await onSubmit(ep);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div>
        <label className="block text-sm">Título</label>
        <input
          required
          className="border rounded w-full p-2 bg-transparent"
          placeholder="Mi episodio increíble"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm">Personajes (d-d-d-d-d)</label>
        <input
          required
          className="border rounded w-full p-2 bg-transparent"
          placeholder="12-14-1-23-8"
          {...register("characters")}
        />
        {errors.characters && (
          <p className="text-red-500 text-sm">{errors.characters.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
