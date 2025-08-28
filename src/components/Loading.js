import React from 'react';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3">
          <h5 className="text-muted">Loading delicious food...</h5>
        </div>
      </div>
    </div>
  );
}
