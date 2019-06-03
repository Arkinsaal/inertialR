import { h, Component } from 'preact';

import NetworkManager from 'Services/NetworkManager';

const styles = {
};

export default class GameList extends Component {

  state = {
    gameList: [],
  }

  componentDidMount() {
    NetworkManager.send('gameList', this.updateGameList);
    NetworkManager.listen('gameAdded', this.addGameToList);
    NetworkManager.listen('gameRemoved', this.removeGameFromList);
  }

  updateGameList = (gameList) => {
    this.setState({
      gameList,
    });
  }

  addGameToList = (game) => {
    this.setState({
      gameList: [
        ...this.state.gameList,
        game,
      ],
    });
  }

  removeGameFromList = (id) => {
    const { gameList } = this.state;

    const index = gameList.findIndex(game => game.id === id);

    gameList.splice(index, 1);

    this.setState({
      gameList,
    });
  }

  joinGame = (game) => {
    const { joinGame } = this.props;

    NetworkManager.send('joinGame', game.id);
  }

  render() {
    const { gameList } = this.state;

    return (
      <div>
        { gameList.map((game) => (
          <div key={game.id} onClick={() => this.joinGame(game)}>{game.name}</div>
        )) }
      </div>
    );
  }
}
