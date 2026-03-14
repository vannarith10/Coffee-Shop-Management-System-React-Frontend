// src/components/ConfirmationAnimation.tsx
import React from "react";

const SendingAnimation: React.FC = () => {
    return (
    <div className="loader">
      <span style={{ "--d": "100ms" } as React.CSSProperties}>s</span>
      <span style={{ "--d": "250ms" } as React.CSSProperties}>e</span>
      <span style={{ "--d": "400ms" } as React.CSSProperties}>n</span>
      <span style={{ "--d": "550ms" } as React.CSSProperties}>d</span>
      <span style={{ "--d": "700ms" } as React.CSSProperties}>i</span>
      <span style={{ "--d": "850ms" } as React.CSSProperties}>n</span>
      <span style={{ "--d": "1000ms" } as React.CSSProperties}>g</span>

      <style>{`
        .loader {
          font-size: 30px;
          display: flex;
          gap: 10px;
        }

        .loader span {
          display: flex;
          align-items: center;
          justify-content: center;
          text-transform: capitalize;
          font-family: sans-serif;
          font-weight: bold;
          color: #aa41fe;
          background-color: #dbd5f3;
          border-radius: 8px;
          min-width: 40px;
          animation: peek 1s both infinite;
          animation-delay: var(--d);
        }

        @keyframes peek {
          25% {
            transform: rotateX(30deg) rotate(-13deg);
          }

          50% {
            transform: translateY(-22px) rotate(3deg) scale(1.1);
            color: #6a45ed;
          }
        }
      `}</style>
    </div>
  );
};

export default SendingAnimation;
