export default class FpsController {
  time = 0;
  fps = [0];

  INVERSE_MAX_FPS = 1000 / 60;
  frameDelta = 0;
  lastUpdate = Date.now();

  isPlaying = false;
  rAF = null;

  constructor(game, { fps, update, render }) {
    this.game = game;

    this.delay = 1000 / fps;
    this.update = update;
    this.render = render;
  }

  loop = () => {
    this.fps.push(1000 / (performance.now() - this.time));
    this.time = performance.now();
    if (this.fps.length > 120) this.fps.shift();

    // Update and render simulation onto canvas
    requestAnimationFrame(this.loop);

    this.render();

    const now = Date.now();

    this.frameDelta += now - this.lastUpdate;
    this.lastUpdate = now;

    while(this.frameDelta >= this.INVERSE_MAX_FPS) {
      this.update(this.frameDelta / 50);

      this.frameDelta -= this.INVERSE_MAX_FPS;
    }
  }

  start = () => {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.rAF = requestAnimationFrame(this.loop);
    }
  };

  pause = () => {
    if (this.isPlaying) {
      cancelAnimationFrame(this.rAF);
      this.isPlaying = false;
      this.time = null;
      this.frame = -1;
    }
  };
}
