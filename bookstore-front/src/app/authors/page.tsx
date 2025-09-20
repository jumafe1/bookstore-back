import { getAuthors } from "@/lib/api";
import type { Author } from "@/lib/schemas";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function AuthorsPage() {
  const authors: Author[] = await getAuthors();
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Authors</h1>
        <Link href="/authors/new" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded">
          Nuevo
        </Link>
      </div>
      <ul className="space-y-3 list-none">
        {authors.map((a: Author) => (
          <li key={a.id} className="border border-zinc-700 rounded p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{a.name} <span className="text-zinc-400">- {a.birthDate}</span></div>
              <div className="flex items-center gap-3">
                <Link className="inline-flex items-center px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-white" href={`/authors/${a.id}/edit`}>Editar</Link>
                <DeleteButton id={a.id} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
