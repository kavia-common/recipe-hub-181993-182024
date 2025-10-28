import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  /** Display a recipe summary card */
  const tags = Array.isArray(recipe.tags) ? recipe.tags : (recipe.tags ? [recipe.tags] : []);
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}>
        <Link to={`/recipe/${recipe.id}`} className="page-title" style={{ fontSize: 18 }}>
          {recipe.title}
        </Link>
        <button
          className={`btn ${isFavorite ? 'secondary' : ''}`}
          onClick={() => onToggleFavorite(recipe)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      {recipe.description && <p className="helper" style={{ marginTop: 8 }}>{recipe.description}</p>}

      <div className="recipe-meta section">
        {recipe.cuisine && <span className="badge">{recipe.cuisine}</span>}
        {tags.slice(0, 4).map((t, idx) => (
          <span key={idx} className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#92400e', borderColor: 'rgba(245,158,11,0.2)' }}>{t}</span>
        ))}
      </div>

      <div className="divider" />
      <Link className="btn ghost" to={`/recipe/${recipe.id}`}>View details →</Link>
    </div>
  );
}
