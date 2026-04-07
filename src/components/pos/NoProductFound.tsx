import React from 'react';

const NoProductFound = () => {
  return (
    <div className="centerContainer">
      <div className="textWrapper">
        <p className="text">No Product Found</p>
        <div className="invertbox"></div>
      </div>
      
      <style>{`
        .centerContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%; /* Fills 100% of parent container */
        }

        .textWrapper {
          height: fit-content;
          min-width: 3rem;
          width: fit-content;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.25ch;
          position: relative;
          z-index: 0;
          color: white;
        }

        .invertbox {
          position: absolute;
          height: 100%;
          aspect-ratio: 1/1;
          left: 0;
          top: 0;
          border-radius: 20%;
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: invert(100%);
          animation: invertMove 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes invertMove {
          50% {
            left: calc(100% - 3rem);
          }
        }
      `}</style>
    </div>
  );
};

export default NoProductFound;