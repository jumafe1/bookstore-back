"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const AuthorSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  birthDate: z.string().min(1, "Fecha requerida"), // yyyy-mm-dd
  image: z.string().url("URL inválida").or(z.literal("")).default(""),
  description: z.string().default(""),
});
export type AuthorInput = z.input<typeof AuthorSchema>;

export default function AuthorForm({
  defaultValues,
  onSubmit,
  submitLabel = "Guardar",
}: Readonly<{
  defaultValues?: Partial<AuthorInput>;
  onSubmit: (data: AuthorInput) => Promise<void> | void;
  submitLabel?: string;
}>) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<AuthorInput>({
      resolver: zodResolver(AuthorSchema),
      defaultValues: {
        name: "", birthDate: "", image: "", description: "", ...defaultValues,
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm">Nombre</label>
        <input id="name" className="border p-2 w-full" {...register("name")} />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="birthDate" className="block text-sm">Fecha de nacimiento</label>
        <input id="birthDate" type="date" className="border p-2 w-full" {...register("birthDate")} />
        {errors.birthDate && <p className="text-red-600 text-sm">{errors.birthDate.message}</p>}
      </div>
      <div>
        <label htmlFor="image" className="block text-sm">Imagen (URL)</label>
        <input id="image" className="border p-2 w-full" {...register("image")} />
        {errors.image && <p className="text-red-600 text-sm">{errors.image.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm">Descripción</label>
        <textarea id="description" rows={3} className="border p-2 w-full" {...register("description")} />
      </div>
      <button disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded">
        {isSubmitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
