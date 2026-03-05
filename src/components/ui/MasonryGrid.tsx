import React from 'react';

interface MasonryGridProps {
  children: React.ReactNode;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ children }) => (
  <>
    <style>{`
      .masonry-grid {
        column-count: 1;
        column-gap: 1.5rem;
      }
      @media (min-width: 768px) {
        .masonry-grid { column-count: 2; }
      }
      @media (min-width: 1024px) {
        .masonry-grid { column-count: 3; }
      }
      @media (min-width: 1440px) {
        .masonry-grid { column-count: 4; }
      }
      .masonry-item {
        break-inside: avoid;
        margin-bottom: 1.5rem;
        display: inline-block;
        width: 100%;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(148, 163, 184, 0.3);
        border-radius: 20px;
      }
    `}</style>
    <div className="masonry-grid">
      {children}
    </div>
  </>
);