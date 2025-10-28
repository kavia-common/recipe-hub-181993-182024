import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

// PUBLIC_INTERFACE
export default function SubmitRecipe() {
  /** Form to submit a new recipe with basic validation */
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cuisine: '',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.ingredients.trim()) e.ingredients = 'Ingredients are required';
    if (!form.instructions.trim()) e.instructions = 'Instructions are required';
    if (form.title.length > 255) e.title = 'Title must be less than 256 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        ingredients: form.ingredients,
        instructions: form.instructions,
        cuisine: form.cuisine || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
      };
      const created = await api.createRecipe(payload);
      navigate(`/recipe/${created.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit recipe');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Submit a Recipe</h1>
      </div>

      <form className="card" style={{ padding: 16 }} onSubmit={onSubmit}>
        <div className="section">
          <label>Title</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., Classic Margherita Pizza"
            aria-invalid={!!errors.title}
          />
          {errors.title && <div className="help-error">{errors.title}</div>}
        </div>

        <div className="section">
          <label>Description</label>
          <input
            className="input"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Short description (optional)"
          />
        </div>

        <div className="section">
          <label>Ingredients</label>
          <textarea
            className="textarea"
            rows={6}
            value={form.ingredients}
            onChange={(e) => updateField('ingredients', e.target.value)}
            placeholder="- 2 cups flour
- 1 cup water
- 1 tsp yeast"
          />
          {errors.ingredients && <div className="help-error">{errors.ingredients}</div>}
        </div>

        <div className="section">
          <label>Instructions</label>
          <textarea
            className="textarea"
            rows={8}
            value={form.instructions}
            onChange={(e) => updateField('instructions', e.target.value)}
            placeholder="1) Mix ingredients...
2) Knead the dough..."
          />
          {errors.instructions && <div className="help-error">{errors.instructions}</div>}
        </div>

        <div className="section" style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label>Cuisine</label>
            <select
              className="select"
              value={form.cuisine}
              onChange={(e) => updateField('cuisine', e.target.value)}
            >
              <option value="">Select cuisine</option>
              <option>Italian</option>
              <option>Indian</option>
              <option>Mexican</option>
              <option>American</option>
              <option>Chinese</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Tags</label>
            <input
              className="input"
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="Comma separated e.g., vegetarian, quick"
            />
          </div>
        </div>

        {submitError && <div className="help-error" style={{ marginTop: 8 }}>{submitError}</div>}

        <div className="toolbar" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
