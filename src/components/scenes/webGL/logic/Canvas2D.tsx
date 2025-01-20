import React, { useRef, useEffect } from 'react';

const Canvas2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const gl = canvas.getContext('webgl');
      if (!gl) {
        console.error('WebGL not supported');
        return;
      }

      // Set clear color and clear the canvas
      gl.clearColor(0.2, 0.4, 0.6, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }, []);

  return <canvas ref={canvasRef} className="w-full h-64 bg-gray-200" />;
};

export default Canvas2D;
