"use client";

import { useMemo } from "react";

type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
};

function EpisodeCardMini({
  ep,
  onToggleFav,
  onRemove,
}: {
  ep: Episode;
  onToggleFav: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="border rounded-lg p-3 bg-white/5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium leading-tight">{ep.name}</p>
          <p className="text-xs text-neutral-400">{ep.episode} • {ep.air_date}</p>
        </div>
        <button
          onClick={() => onToggleFav(ep.id)}
          title="Quitar de favoritos"
          className="text-xl leading-none"
        >
          ⭐
        </button>
      </div>
      <div className="mt-2">
        <button
          onClick={() => onRemove(ep.id)}
          className="text-red-500 text-sm underline"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}

export default function FavoritesPanel({
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
            <EpisodeCardMini
              key={ep.id}
              ep={ep}
              onToggleFav={onToggleFav}
              onRemove={onRemoveFav}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export { FavoritesPanel };
