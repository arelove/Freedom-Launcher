import React, { useEffect, useRef } from 'react';
import Scrollbar from 'smooth-scrollbar';

interface SmoothScrollContainerProps {
  children: React.ReactNode;
  damping?: number;
  thumbMinSize?: number;
  renderByPixels?: boolean;
  height?: string; // высота контейнера, если нужно
}

const SmoothScrollContainer: React.FC<SmoothScrollContainerProps> = ({
  children,
  damping = 0.05,
  thumbMinSize = 20,
  renderByPixels = true,
  height = '67vh', // значение по умолчанию
}) => {
  const scrollbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollbarRef.current) {
      const scrollbar = Scrollbar.init(scrollbarRef.current, {
        damping,
        thumbMinSize,
        renderByPixels,
      });

      return () => {
        scrollbar.destroy();
      };
    }
  }, [damping, thumbMinSize, renderByPixels]);

  return (
    <div
      ref={scrollbarRef}
      style={{
        height,
        position: 'relative',
        paddingRight: '10px',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: '100%', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default SmoothScrollContainer;
