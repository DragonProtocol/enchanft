/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-underscore-dangle */
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { Cube } from './cube';
import Control from './control';

// TODO
export class RandomControl extends Control {
  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    cube: Cube
  ) {
    super(camera, scene, renderer, cube);

    this.init();
  }

  public mousedownHandle(event: MouseEvent) {
    event.preventDefault();
    this.operateStart(event.offsetX, event.offsetY);
  }

  public mouseupHandle(event: MouseEvent) {
    event.preventDefault();
    this.operateEnd();
  }

  public moveHandle(event: MouseEvent) {
    event.preventDefault();
    this.operateDrag(
      event.offsetX,
      event.offsetY,
      event.movementX,
      event.movementY
    );
  }

  public init(): void {}

  public dispose(): void {}
}
