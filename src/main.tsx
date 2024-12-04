// main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Код для перетаскивания окна
window.addEventListener('DOMContentLoaded', () => {
  const titleBar = document.getElementById('titleBar');

  if (titleBar) {
    let isDragging = false;
    let offsetX: number;
    let offsetY: number;

    titleBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX;
      offsetY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        window.moveBy(x, y);
        offsetX = e.clientX;
        offsetY = e.clientY;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
});






