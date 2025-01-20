import React from 'react';
import Canvas2D from '../logic/Canvas2D';
import Canvas3D from '../logic/Canvas3D';

const WebGLHome: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">WebGL Demo</h1>
      <Canvas2D />
      <Canvas3D />
    </div>
  );
};

export default WebGLHome;
