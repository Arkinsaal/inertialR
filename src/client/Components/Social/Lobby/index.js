import { h, Component } from 'preact';

import GameList from './GameList';
import GameSetup from './GameSetup';
import Game from './Game';

import NetworkManager from 'Services/NetworkManager';

const styles = {
};

export default class Lobby extends Component {
  state = {
    mode: 'viewing', // viewing, creating
    game: null,
  }

  componentDidMount() {
    NetworkManager.listen('joinedGame', this.joinGame);
    NetworkManager.listen('leftGame', this.leaveGame);
  }

  setMode = (mode) => {
    this.setState({
      mode,
    });
  }

  joinGame = (game) => {
    this.setState({
      game,
    });
  }

  leaveGame = () => {
    this.setState({
      game: null,
    });
  }

  disconnect = () => {
    NetworkManager.disconnect();
  }

  render() {
    const { setGameId } = this.props;
    const { mode, game } = this.state;

    return (
      <div>
        <button onClick={this.disconnect}>Leave Lobby</button>
        <div>
          {!game && {
            viewing: <div>
              <GameList joinGame={this.joinGame} />
              <button onClick={() => this.setMode('creating')}>Setup New Game</button>
            </div>,
            creating: <GameSetup joinGame={this.joinGame} cancelSetup={() => this.setMode('viewing')} />,
          }[mode]}
          {game && <Game game={game} />}
        </div>
      </div>
    );
  }
}
