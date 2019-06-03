import { h, Component, createRef } from 'preact';

import Main from '../../Game/Main';

const canvasStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}

export default class Game extends Component {

  canvas = createRef();
  backgroundCanvas = createRef();
  context = null;
  backgroundContext = null;

  game = null;

  shouldComponentUpdate(nextProps) {
    return nextProps.game !== this.props.game;
  }

  componentDidMount() {
    this.context = this.canvas.getContext('2d');
    this.backgroundContext = this.backgroundCanvas.getContext('2d');

    this.game = new Main({
      foreground: {
        canvas: this.canvas,
        context: this.context,
      },
      background: {
        canvas: this.backgroundCanvas,
        context: this.backgroundContext,
      },
    }, this.props.game);
  }

  componentDidUpdate() {
    this.context = this.canvas.getContext('2d');
    this.backgroundContext = this.backgroundCanvas.getContext('2d');

    this.game = new Main({
      foreground: {
        canvas: this.canvas,
        context: this.context,
      },
      background: {
        canvas: this.backgroundCanvas,
        context: this.backgroundContext,
      },
    }, this.props.game);
  }

  render() {
    return (
      <main
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
        }}
      >
        <canvas
          ref={(canvas) => (this.backgroundCanvas = canvas)}
          style={canvasStyle}
        />
        <canvas
          ref={(canvas) => (this.canvas = canvas)}
          style={canvasStyle}
        />
      </main>
    )
  }
}
