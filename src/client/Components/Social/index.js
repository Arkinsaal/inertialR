import { h, Component } from 'preact';

import Login from './Login';
import Lobby from './Lobby';

import Drawer from 'Components/common/Drawer';

import NetworkManager from 'Services/NetworkManager';
import { getNewGuid } from 'Services/helpers';
import { loadFirst } from 'Services/decorators';

const styles = {
  toggle: {
    width: '40px',
    height: '40px',
    backgroundColor: 'blue',
  },
};

export default class Social extends Component {
  state = {
    loading: false,
    connected: false,
    userId: getNewGuid(),
  }

  @loadFirst
  connect = () => {
    const { userId } = this.state;

    NetworkManager.connect(userId);

    this.setupListeners();
  }

  @loadFirst
  disconnect = () => {
    NetworkManager.disconnect();
  }

  onConnect = () => {
    this.setState({
      connected: true,
      loading: false,
    }, this.setupListeners);
  }

  onDisconnect = () => {
    this.setState({
      connected: false,
      loading: false,
    });
  }

  setupListeners() {
    NetworkManager.listen('connect', this.onConnect);
    NetworkManager.listen('disconnect', this.onDisconnect);
    NetworkManager.listen('startGame', this.props.setGame);
  }

  render() {
    const { connected } = this.state;

    return (
      <Drawer
        button={<div style={styles.toggle} />}
      >
        { connected
          ? <Lobby disconnect={this.disconnect} />
          : <Login connect={this.connect} />
        }
      </Drawer>
    );
  }
}
