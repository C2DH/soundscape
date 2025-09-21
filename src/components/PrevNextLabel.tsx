import React, { useEffect, useState } from 'react';
import './PrevNextLabel.css'; // import CSS

interface PrevNextLabelProps {
  hoverPrev?: boolean;
  hoverNext?: boolean;
  prevName?: string;
  nextName?: string;
}

const PrevNextLabel: React.FC<PrevNextLabelProps> = ({
  hoverPrev,
  hoverNext,
  prevName,
  nextName,
}) => {
  const [text, setText] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const newText =
    hoverNext && nextName
      ? `Next: ${nextName}`
      : hoverPrev && prevName
        ? `Prev: ${prevName}`
        : null;

  useEffect(() => {
    if (newText !== text) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setText(newText);
        setAnimating(false);
      }, 150); // matches fade-out duration
      return () => clearTimeout(timeout);
    }
  }, [newText, text]);

  return (
    <>
      {(hoverPrev || hoverNext) && (prevName || nextName) && (
        <div aria-hidden className="tooltip-container">
          {text && (
            <span className={`tooltip-text ${animating ? 'fade-out' : 'fade-in'}`}>{text}</span>
          )}
        </div>
      )}
    </>
  );
};

export default PrevNextLabel;
