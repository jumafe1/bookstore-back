"use client";

import { useEffect, useState } from "react";

export type Episode = {
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
  if (first5.length === 0) return [];
  const ids = first5.map(charIdFromUrl).join(",");
  const res = await fetch(`${API}/character/${ids}`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

function EpisodeCard({
  ep,
  isFav,
  onToggleFav,
}: {
  ep: Episode;
  isFav: boolean;
  onToggleFav: (id: number) => void;
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
          <p className="text-xs text-neutral-400">
            {ep.episode} • {ep.air_date}
          </p>
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
            <img
              src={c.image}
              alt={c.name}
              width={48}
              height={48}
              className="object-cover mx-auto"
            />
            <p className="text-[10px] mt-1 truncate">{c.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ItemsGrid({
  episodes,
  favorites,
  onToggleFav,
}: {
  episodes: Episode[];
  favorites: number[];
  onToggleFav: (id: number) => void;
}) {
  if (!episodes || episodes.length === 0) {
    return <p className="text-sm text-neutral-400">Cargando...</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {episodes.map((ep) => (
        <EpisodeCard
          key={ep.id}
          ep={ep}
          isFav={favorites.includes(ep.id)}
          onToggleFav={onToggleFav}
        />
      ))}
    </div>
  );
}
