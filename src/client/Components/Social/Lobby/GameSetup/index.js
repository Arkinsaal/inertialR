import { h, Component } from 'preact';

import NetworkManager from 'Services/NetworkManager';

const styles = {
};

export default class GameSetup extends Component {
  createGame = () => {
    NetworkManager.send('createGame', {
      name: 'My New Game',
      password: null,
      players: [1, 8],
    });
  }

  onCancel = () => {
    this.props.cancelSetup();
  }

  render() {
    return (
      <div>
        <button onClick={this.onCancel}>Return</button>



        <button onClick={this.createGame}>Create Game</button>
      </div>
    );
  }
}
