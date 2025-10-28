import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

// PUBLIC_INTERFACE
export function useRecipesList(initialQuery = {}) {
  /** Fetch paginated recipes with search params */
  const [query, setQuery] = useState({ page: 1, page_size: 12, ...initialQuery });
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 12 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await api.listRecipes(query);
      setData(res);
    } catch (e) {
      setError(e.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [JSON.stringify(query)]);

  return { query, setQuery, data, loading, error, reload: load };
}

// PUBLIC_INTERFACE
export function useFavorites() {
  /** Manage favorites list and provide add/remove helpers */
  const [ids, setIds] = useState(new Set());
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const favs = await api.listFavorites();
      setList(favs);
      setIds(new Set(favs.map(f => f.recipe_id)));
    } finally {
      setLoading(false);
    }
  }

  async function add(recipeId) {
    await api.addFavorite(recipeId);
    await refresh();
  }

  async function remove(recipeId) {
    await api.removeFavorite(recipeId);
    await refresh();
  }

  useEffect(() => { refresh(); }, []);

  const isFavorite = useMemo(() => (rid) => ids.has(rid), [ids]);

  return { favorites: list, isFavorite, addFavorite: add, removeFavorite: remove, refresh, loading };
}
