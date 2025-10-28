import React from 'react';

// PUBLIC_INTERFACE
export default function Pagination({ page, pageSize, total, onChange }) {
  /** Pagination control with prev/next and page info */
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="toolbar" style={{ justifyContent: 'space-between', marginTop: 16 }}>
      <div className="helper">Page {page} of {totalPages} • {total} results</div>
      <div className="toolbar">
        <button className="btn ghost" disabled={prevDisabled} onClick={() => onChange(page - 1)}>← Prev</button>
        <button className="btn ghost" disabled={nextDisabled} onClick={() => onChange(page + 1)}>Next →</button>
      </div>
    </div>
  );
}
