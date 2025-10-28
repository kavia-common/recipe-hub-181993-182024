import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Navigation bar with brand, search box, and links */
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [term, setTerm] = useState(params.get('q') || '');

  function onSearchSubmit(e) {
    e.preventDefault();
    // Navigate to Home with query
    const qs = new URLSearchParams(location.search);
    if (term) qs.set('q', term);
    else qs.delete('q');
    navigate({ pathname: '/', search: qs.toString() });
  }

  return (
    <div className="nav-inner">
      <Link to="/" className="brand" aria-label="Recipe Hub Home">
        <span style={{
          display: 'inline-flex',
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(37,99,235,.15), rgba(245,158,11,.15))',
          border: '1px solid #e5e7eb',
          alignItems: 'center', justifyContent: 'center'
        }}>🍳</span>
        <span>Recipe Hub</span>
      </Link>

      <form className="searchbar" onSubmit={onSearchSubmit} role="search">
        <span className="icon">🔍</span>
        <input
          className="input"
          placeholder="Search recipes by title or description..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Search recipes"
        />
      </form>

      <div className="nav-links">
        <Link className="btn ghost" to="/">Browse</Link>
        <Link className="btn ghost" to="/favorites">Favorites</Link>
        <Link className="btn secondary" to="/submit">Submit Recipe</Link>
      </div>
    </div>
  );
}
