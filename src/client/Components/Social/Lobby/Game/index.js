import { h, Component } from 'preact';

import NetworkManager from 'Services/NetworkManager';

const styles = {
};

export default class Game extends Component {
  state = {
    players: [],
  }

  componentDidMount() {
    NetworkManager.send('players', {}, this.updatePlayers);
    NetworkManager.listen('joinedGame', this.addPlayerToList);
    NetworkManager.listen('leftGame', this.removePlayerFromList);
  }

  updatePlayers = (players) => {
    this.setState({
      players,
    });
  }

  addPlayerToList = (player) => {
    this.setState({
      players: [
        ...this.state.players,
        player,
      ],
    });
  }

  removePlayerFromList = (id) => {
    const { players } = this.state;

    const index = players.findIndex(player => player.id === id);

    players.splice(index, 1);

    this.setState({
      players,
    });
  }

  startGame = () => {
    NetworkManager.send('startGame', {});
  }

  render() {
    const { game } = this.props;
    const { players } = this.state;

    return (
      <div>
        <div>
          { players.map((player) => (
            <div key={player.id}>{player.name}</div>
          )) }
        </div>

        <button onClick={this.updateSettings}>Update Settings</button>
        <button onClick={this.startGame}>Start Game</button>
      </div>
    );
  }
}
