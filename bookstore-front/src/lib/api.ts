import { Author, AuthorCreate } from "./schemas";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function getAuthors(): Promise<Author[]> {
  const res = await fetch(`${BASE_URL}/api/authors`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch authors: ${res.status}`);
  // Backend returns java.util.Date as epoch ms or ISO depending on config; cast to string here.
  const data = (await res.json()) as Array<{
    id: number;
    birthDate: string | number | null;
    name: string;
    description: string;
    image: string;
  }>;
  return data.map((a) => ({
    id: a.id,
    birthDate: a.birthDate == null ? "" : String(a.birthDate),
    name: a.name,
    description: a.description,
    image: a.image,
  }));
}

async function j<T>(r: Response): Promise<T> {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json() as Promise<T>;
}


export async function getAuthor(id: number): Promise<Author> {
  return j<Author>(await fetch(`${BASE_URL}/api/authors/${id}`, { cache: "no-store" }));
}

export async function createAuthor(a: AuthorCreate): Promise<Author> {
  const r = await fetch(`${BASE_URL}/api/authors`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(a),
  });
  return j<Author>(r);
}

export async function updateAuthor(id: number, a: AuthorCreate): Promise<Author> {
  const r = await fetch(`${BASE_URL}/api/authors/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(a),
  });
  return j<Author>(r);
}

export async function deleteAuthor(id: number): Promise<void> {
  const r = await fetch(`${BASE_URL}/api/authors/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}
