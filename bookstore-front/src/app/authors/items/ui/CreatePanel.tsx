"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


type Episode = {
  id: number;
  name: string;       // titulo
  air_date: string;   // yyyy-mm-dd
  episode: string;    // ep
  characters: string[]; // solo se consume la 5 primeras
};

const API = "https://rickandmortyapi.com/api";


const FormSchema = z.object({
  title: z.string().min(6, "Mínimo 6 caracteres"),
  characters: z
    .string()
    .regex(/^\d+-\d+-\d+-\d+-\d+$/, "Formato: d-d-d-d-d (solo números y guiones)"),
});
type FormValues = z.infer<typeof FormSchema>;

export default function CreatePanel({
  onCreated,
  toast,
}: {
  onCreated: (ep: Episode) => void;
  toast: (msg: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange", 
    defaultValues: { title: "", characters: "" },
  });

  async function onSubmit(values: FormValues) {
 
    const ids = values.characters.split("-").map((n) => Number(n));
    const fake: Episode = {
      id: Date.now(),
      name: values.title,
      air_date: new Date().toISOString().slice(0, 10),
      episode: "S00E00",
      characters: ids.map((id) => `${API}/character/${id}`), 
    };

    onCreated(fake);
    toast("Episodio guardado ");
    reset();
  }

  return (
    <section className="border rounded-lg p-4 bg-white/5 backdrop-blur">
      <h2 className="font-semibold mb-3">Formulario</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Título</label>
          <input
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
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </section>
  );
}

export { CreatePanel };
