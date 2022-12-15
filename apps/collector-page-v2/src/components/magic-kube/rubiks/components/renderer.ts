import { WebGLRenderer } from 'three';

const createRenderer = () => {
  // const renderer = new WebGLRenderer({ antialias: true });
  const renderer = new WebGLRenderer({ alpha: true });
  renderer.setClearColor(0x000000, 0);

  return renderer;
};

export default createRenderer;
