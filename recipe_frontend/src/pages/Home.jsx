import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { useFavorites, useRecipesList } from '../state/useRecipes';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page: search, filter by cuisine/tag, paginated list */
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);

  const initial = {
    q: urlParams.get('q') || '',
    cuisine: urlParams.get('cuisine') || '',
    tag: urlParams.get('tag') || '',
    page: parseInt(urlParams.get('page') || '1', 10),
    page_size: 12,
  };

  const { query, setQuery, data, loading, error } = useRecipesList(initial);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // sync URL with query
  useEffect(() => {
    const qs = new URLSearchParams();
    if (query.q) qs.set('q', query.q);
    if (query.cuisine) qs.set('cuisine', query.cuisine);
    if (query.tag) qs.set('tag', query.tag);
    if (query.page && query.page !== 1) qs.set('page', String(query.page));
    navigate({ pathname: '/', search: qs.toString() }, { replace: true });
  }, [query, navigate]);

  function setField(field, value) {
    setQuery((q) => ({ ...q, [field]: value, page: 1 }));
  }

  function onPageChange(p) {
    setQuery((q) => ({ ...q, page: p }));
  }

  function onToggleFavorite(recipe) {
    if (isFavorite(recipe.id)) removeFavorite(recipe.id);
    else addFavorite(recipe.id);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Discover Recipes</h1>
          <p className="helper">Search, filter, and explore community-submitted recipes.</p>
        </div>
        <div className="toolbar">
          <select
            className="select"
            value={query.cuisine}
            onChange={(e) => setField('cuisine', e.target.value)}
            aria-label="Filter by cuisine"
          >
            <option value="">All cuisines</option>
            <option>Italian</option>
            <option>Indian</option>
            <option>Mexican</option>
            <option>American</option>
            <option>Chinese</option>
            <option>Other</option>
          </select>
          <input
            className="input"
            placeholder="Filter by tag (e.g., vegan)"
            value={query.tag}
            onChange={(e) => setField('tag', e.target.value)}
            aria-label="Filter by tag"
          />
        </div>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 16 }}>
        <input
          className="input"
          placeholder="Search recipes..."
          value={query.q}
          onChange={(e) => setField('q', e.target.value)}
          aria-label="Search recipes"
        />
      </div>

      {error && <div className="card help-error" style={{ padding: 12 }}>{error}</div>}
      {loading && <div className="card" style={{ padding: 12 }}>Loading recipes…</div>}

      {!loading && data.items?.length === 0 && (
        <div className="card" style={{ padding: 16 }}>No recipes found.</div>
      )}

      <div className="grid cols-3">
        {data.items?.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            isFavorite={isFavorite(r.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      <Pagination
        page={data.page || query.page}
        pageSize={data.page_size || query.page_size}
        total={data.total || 0}
        onChange={onPageChange}
      />
    </div>
  );
}
