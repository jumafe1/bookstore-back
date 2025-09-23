"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import ItemsGrid from "../authors/items/ui/ItemsGrid";
import { FavoritesPanel as EpisodeFavoritesPanel } from "../authors/items/ui/FavoritesPanel";
import { CreatePanel as CreateEpisodePanel } from "../authors/items/ui/CreatePanel";

type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
};

const API = "https://rickandmortyapi.com/api";

async function fetchEpisodes(): Promise<Episode[]> {
  const res = await fetch(`${API}/episode`);
  if (!res.ok) throw new Error("No se pudo cargar episodios");
  const data = await res.json();
  return data.results as Episode[];
}

const FAV_KEY = "favorites:episodes";
const LOCAL_EPISODES_KEY = "episodes:local";
function loadFavs(): number[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveFavs(ids: number[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

function loadLocalEpisodes(): Episode[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_EPISODES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalEpisodes(list: Episode[]) {
  localStorage.setItem(LOCAL_EPISODES_KEY, JSON.stringify(list));
}

export default function ItemsPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const api = await fetchEpisodes();
        const locals = loadLocalEpisodes();
        setEpisodes([...locals, ...api]);
      } catch {
        setEpisodes(loadLocalEpisodes());
      }
    })();
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
    const current = loadLocalEpisodes();
    saveLocalEpisodes([ep, ...current]);
  }

  return (
    <main className="p-6 max-w-6xl mx-auto grid grid-cols-[2fr_1fr] gap-6 bg-white text-black min-h-screen">
      {/* lista desde API */}
      <section className="border rounded-lg p-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
        <h1 className="text-lg font-bold mb-4">Lista desde API</h1>
        <ItemsGrid episodes={episodes.slice(0, 5)} favorites={favorites} onToggleFav={toggleFavorite} />
      </section>

      {/* Favoritos y formulario */}
      <aside className="space-y-6">
        <EpisodeFavoritesPanel
          episodes={episodes}
          favorites={favorites}
          onToggleFav={toggleFavorite}
          onRemoveFav={removeFavorite}
        />
        <CreateEpisodePanel onCreated={addLocalEpisode} toast={(m) => toast.success(m)} />
      </aside>
    </main>
  );
}


