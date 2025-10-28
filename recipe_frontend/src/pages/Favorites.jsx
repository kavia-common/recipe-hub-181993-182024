import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useFavorites } from '../state/useRecipes';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Favorites() {
  /** Favorites page listing user's favorite recipes */
  const { favorites, removeFavorite } = useFavorites();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Since API doesn't provide recipe details in favorites, we fetch each recipe
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const list = await Promise.all(
          favorites.map(async (f) => {
            try { return await api.getRecipe(f.recipe_id); }
            catch { return null; }
          })
        );
        if (mounted) setRecipes(list.filter(Boolean));
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [favorites]);

  if (loading) return <div className="card" style={{ padding: 16 }}>Loading favorites…</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Your Favorites</h1>
        <div className="helper">{recipes.length} saved</div>
      </div>

      {recipes.length === 0 && (
        <div className="card" style={{ padding: 16 }}>
          You have no favorites yet. Explore <Link className="btn ghost" to="/">recipes</Link>.
        </div>
      )}

      <div className="grid cols-3">
        {recipes.map((r) => (
          <div key={r.id} className="card" style={{ padding: 16 }}>
            <div className="toolbar" style={{ justifyContent: 'space-between' }}>
              <Link to={`/recipe/${r.id}`} className="page-title" style={{ fontSize: 18 }}>
                {r.title}
              </Link>
              <button className="btn secondary" onClick={() => removeFavorite(r.id)}>Remove ★</button>
            </div>
            {r.description && <p className="helper" style={{ marginTop: 8 }}>{r.description}</p>}
            <div className="divider" />
            <Link className="btn ghost" to={`/recipe/${r.id}`}>View details →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
