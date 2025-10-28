import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { useFavorites } from '../state/useRecipes';

// PUBLIC_INTERFACE
export default function RecipeDetail() {
  /** Detailed view of a recipe with add/remove favorites */
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await api.getRecipe(id);
        if (mounted) setRecipe(r);
      } catch (e) {
        setError(e.message || 'Failed to load recipe');
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (error) return <div className="card help-error" style={{ padding: 16 }}>{error}</div>;
  if (!recipe) return <div className="card" style={{ padding: 16 }}>Loading…</div>;

  const tags = Array.isArray(recipe.tags) ? recipe.tags : (recipe.tags ? [recipe.tags] : []);

  const favorite = isFavorite(recipe.id);
  const toggleFav = async () => {
    if (favorite) await removeFavorite(recipe.id);
    else await addFavorite(recipe.id);
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="page-header">
        <h1 className="page-title">{recipe.title}</h1>
        <button className={`btn ${favorite ? 'secondary' : ''}`} onClick={toggleFav}>
          {favorite ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
      </div>

      {recipe.description && <p className="helper">{recipe.description}</p>}

      <div className="recipe-meta section">
        {recipe.cuisine && <span className="badge">{recipe.cuisine}</span>}
        {tags.map((t, idx) => (
          <span key={idx} className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#92400e', borderColor: 'rgba(245,158,11,0.2)' }}>{t}</span>
        ))}
      </div>

      <div className="divider" />

      <div className="section">
        <h3 style={{ marginBottom: 6 }}>Ingredients</h3>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f4f6', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}>
          {recipe.ingredients}
        </pre>
      </div>

      <div className="section">
        <h3 style={{ marginBottom: 6 }}>Instructions</h3>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f4f6', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}>
          {recipe.instructions}
        </pre>
      </div>
    </div>
  );
}
