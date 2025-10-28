//
// PUBLIC_INTERFACE
// Simple API client for Recipe Hub with environment-based baseURL and X-User-Id header.
//
/** This module exports helper methods to interact with the backend API. */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function ensureUserId() {
  let uid = localStorage.getItem('userId');
  if (!uid) {
    // RFC4122 v4 simple generator
    uid = ([1e7]+-1e3+-4e3+-8e3+-1e11)
      .replace(/[018]/g, c =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
      );
    localStorage.setItem('userId', uid);
  }
  return uid;
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('X-User-Id', ensureUserId());
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.detail) message = JSON.stringify(data.detail);
    } catch (_) {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export function listRecipes({ q, cuisine, tag, page = 1, page_size = 12 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (cuisine) params.set('cuisine', cuisine);
  if (tag) params.set('tag', tag);
  params.set('page', page);
  params.set('page_size', page_size);
  return request(`/recipes?${params.toString()}`);
}

// PUBLIC_INTERFACE
export function getRecipe(id) {
  return request(`/recipes/${id}`);
}

// PUBLIC_INTERFACE
export function createRecipe(payload) {
  return request(`/recipes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// PUBLIC_INTERFACE
export function listFavorites() {
  return request(`/favorites`);
}

// PUBLIC_INTERFACE
export function addFavorite(recipe_id) {
  return request(`/favorites`, {
    method: 'POST',
    body: JSON.stringify({ recipe_id }),
  });
}

// PUBLIC_INTERFACE
export function removeFavorite(recipe_id) {
  // prefer the path variant provided by API
  return request(`/favorites/${recipe_id}`, { method: 'DELETE' });
}

export default {
  listRecipes,
  getRecipe,
  createRecipe,
  listFavorites,
  addFavorite,
  removeFavorite,
};
