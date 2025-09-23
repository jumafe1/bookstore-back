"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; 

type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[]; 
};

type Character = {
  id: number;
  name: string;
  image: string;
};

const API = "https://rickandmortyapi.com/api";


const charIdFromUrl = (u: string) => Number(u.split("/").pop());

async function fetchFirst5Characters(urls: string[]): Promise<Character[]> {
  const first5 = urls.slice(0, 5);
  const ids = first5.map(charIdFromUrl).join(",");
  const res = await fetch(`${API}/character/${ids}`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

async function fetchEpisodes(): Promise<Episode[]> {
  const res = await fetch(`${API}/episode`);
  if (!res.ok) throw new Error("No se pudo cargar episodios");
  const data = await res.json();
  return data.results as Episode[];
}


const FAV_KEY = "favorites:episodes";
function loadFavs(): number[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}
function saveFavs(ids: number[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

/* Validación (Zod) */
const FormSchema = z.object({
  title: z.string().min(6, "Mínimo 6 caracteres"),
  characters: z
    .string()
    .regex(/^\d+-\d+-\d+-\d+-\d+$/, "Formato: d-d-d-d-d (solo números y guiones)"),
});
type FormValues = z.infer<typeof FormSchema>;

/* Components */
function EpisodeCard({
  ep,
  isFav,
  onToggleFav,
  onRemove,
}: {
  ep: Episode;
  isFav: boolean;
  onToggleFav: (id: number) => void;
  onRemove?: (id: number) => void;
}) {
  const [chars, setChars] = useState<Character[]>([]);
  useEffect(() => {
    fetchFirst5Characters(ep.characters).then(setChars).catch(() => setChars([]));
  }, [ep.characters]);

  return (
    <div className="border rounded-lg p-4 bg-white/5 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{ep.name}</h3>
          <p className="text-xs text-neutral-400">{ep.episode} • {ep.air_date}</p>
        </div>
        <button
          onClick={() => onToggleFav(ep.id)}
          title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
          className={`text-xl leading-none ${isFav ? "" : "opacity-40"}`}
        >
          ⭐
        </button>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {chars.map((c) => (
          <div key={c.id} className="text-center">
            <img src={c.image} alt={c.name} className="h-12 w-12 rounded-full object-cover mx-auto" />
            <p className="text-[10px] mt-1 truncate">{c.name}</p>
          </div>
        ))}
      </div>

      {!!onRemove && (
        <div className="mt-3">
          <button onClick={() => onRemove(ep.id)} className="text-red-500 text-sm underline">
            Quitar de favoritos
          </button>
        </div>
      )}
    </div>
  );
}

function FormPanel({ onCreated }: { onCreated: (ep: Episode) => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    const [a, b, c, d, e] = values.characters.split("-").map((n) => Number(n));
    const fake: Episode = {
      id: Date.now(),
      name: values.title,
      air_date: new Date().toISOString().slice(0, 10),
      episode: "S00E00",
      characters: [a, b, c, d, e].map((id) => `${API}/character/${id}`),
    };
    onCreated(fake);
    toast.success("Episodio guardado "); // 
    reset();
  }

  return (
    <section className="border rounded-lg p-4 bg-white/5 backdrop-blur">
      <h2 className="font-semibold mb-3">Formulario</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Título</label>
          <input className="border rounded w-full p-2 bg-transparent" {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Personajes (d-d-d-d-d)</label>
          <input
            className="border rounded w-full p-2 bg-transparent"
            placeholder="12-14-1-23-8"
            {...register("characters")}
          />
          {errors.characters && <p className="text-red-500 text-sm">{errors.characters.message}</p>}
        </div>
        <button
          disabled={isSubmitting || !isValid}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </section>
  );
}

function FavoritesPanel({
  episodes,
  favorites,
  onToggleFav,
  onRemoveFav,
}: {
  episodes: Episode[];
  favorites: number[];
  onToggleFav: (id: number) => void;
  onRemoveFav: (id: number) => void;
}) {
  const favEpisodes = useMemo(
    () => episodes.filter((e) => favorites.includes(e.id)),
    [episodes, favorites]
  );

  return (
    <section className="border rounded-lg p-4 bg-white/5 backdrop-blur">
      <h2 className="font-semibold mb-3">Favoritos</h2>
      {favEpisodes.length === 0 ? (
        <p className="text-sm text-neutral-400">Sin favoritos</p>
      ) : (
        <div className="space-y-3">
          {favEpisodes.map((ep) => (
            <EpisodeCard
              key={ep.id}
              ep={ep}
              isFav
              onToggleFav={onToggleFav}
              onRemove={onRemoveFav}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* Página */
export default function ItemsPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetchEpisodes().then(setEpisodes).catch(() => setEpisodes([]));
  }, []);

  useEffect(() => {
    setFavorites(loadFavs());
  }, []);

  function toggleFavorite(id: number) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveFavs(next);
      if (prev.includes(id)) toast("Quitado de favoritos ");
      else toast.success("Agregado a favoritos ");
      return next;
    });
  }

  function removeFavorite(id: number) {
    setFavorites((prev) => {
      const next = prev.filter((x) => x !== id);
      saveFavs(next);
      toast("Quitado de favoritos ");
      return next;
    });
  }

  function addLocalEpisode(ep: Episode) {
    setEpisodes((prev) => [ep, ...prev]);
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Listado */}
      <section className="lg:col-span-2">
        <h1 className="text-xl font-bold mb-4">Listado</h1>
        {episodes.length === 0 ? (
          <p className="text-sm text-neutral-400">Cargando...</p>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {episodes.map((ep) => (
              <EpisodeCard
                key={ep.id}
                ep={ep}
                isFav={favorites.includes(ep.id)}
                onToggleFav={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      {/* Formularioyfavoritos */}
      <aside className="space-y-6">
        <FormPanel onCreated={addLocalEpisode} />
        <FavoritesPanel
          episodes={episodes}
          favorites={favorites}
          onToggleFav={toggleFavorite}
          onRemoveFav={removeFavorite}
        />
      </aside>
    </main>
  );
}
