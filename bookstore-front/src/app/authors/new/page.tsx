import { redirect } from "next/navigation";
import AuthorForm, { AuthorInput } from "@/app/components/AuthorForm";
import { createAuthor } from "@/lib/api";

export default function NewAuthorPage() {
  async function onSubmit(data: AuthorInput) {
    "use server";
    await createAuthor(data);
    redirect("/authors");
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Crear autor</h1>
      <AuthorForm onSubmit={onSubmit} submitLabel="Crear" />
    </main>
  );
}
