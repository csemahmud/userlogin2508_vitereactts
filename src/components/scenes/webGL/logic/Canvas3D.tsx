import React, { useRef, useEffect } from 'react';

const Canvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const gl = canvas.getContext('webgl');
      if (!gl) {
        console.error('WebGL not supported');
        return;
      }

      // Set viewport and perspective
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.1, 0.1, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Example: render a point
      gl.enable(gl.DEPTH_TEST);
      const vertexShaderSource = `
        attribute vec4 position;
        void main() {
          gl_Position = position;
          gl_PointSize = 10.0;
        }
      `;
      const fragmentShaderSource = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `;
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader!, vertexShaderSource);
      gl.compileShader(vertexShader!);

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader!, fragmentShaderSource);
      gl.compileShader(fragmentShader!);

      const program = gl.createProgram();
      gl.attachShader(program!, vertexShader!);
      gl.attachShader(program!, fragmentShader!);
      gl.linkProgram(program!);
      gl.useProgram(program!);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [0, 0, 0];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(program!, 'position');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }, []);

  return <canvas ref={canvasRef} className="w-full h-64 bg-gray-900" />;
};

export default Canvas3D;
