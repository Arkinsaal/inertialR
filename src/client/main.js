import { h, render, Component } from 'preact';

import Game from 'Components/Game';
import Social from 'Components/Social';

import { getNewGuid } from 'Services/helpers';
import { generateBoundary, generateCheckPoints, generateBlackHoles } from 'Services/generators';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    display: 'flex'
  },
  grow: {
    flexGrow: 1,
  },
};

class Main extends Component {
  state = {
    loading: false,
    game: {
      id: getNewGuid(),
      boundary: generateBoundary(),
      blackHoles: generateBlackHoles(),
      checkPoints: generateCheckPoints(),
    },
  }

  setGame = (game) => {
    this.setState({
      game,
    });
  }

  render() {
    const { game } = this.state;

    return (
      <div style={styles.root}>
        <header style={styles.header}>
          <div style={styles.grow} />
          <Social setGame={this.setGame} />
        </header>

        <Game game={game} />
      </div>
    );
  }
}

render(
  <Main />,
  document.getElementById('main')
);
