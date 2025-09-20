import { notFound, redirect } from "next/navigation";
import { getAuthor, updateAuthor } from "@/lib/api";
import AuthorForm, { AuthorInput } from "@/app/components/AuthorForm";

type Props = { params: { id: string } };

export default async function EditAuthorPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  const author = await getAuthor(id).catch(() => null);
  if (!author) return notFound();

  async function onSubmit(data: AuthorInput) {
    "use server";
    await updateAuthor(id, data);
    redirect("/authors");
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar autor</h1>
      <AuthorForm
        defaultValues={{
          name: author.name,
          birthDate: author.birthDate?.slice(0,10) ?? "",
          image: author.image ?? "",
          description: author.description ?? "",
        }}
        onSubmit={onSubmit}
        submitLabel="Guardar cambios"
      />
    </main>
  );
}
