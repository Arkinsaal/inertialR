import { h, Component } from 'preact';

import { mergeStyles } from 'Services/helpers';

const styles = {
  drawer: {
    pointerEvents: 'all',
  },
  sidebar: {
    height: '100%',
    width: '100%',
    maxWidth: '300px',
    position: 'fixed',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  collapsed: {
    transform: 'translateX(100%)',
  },
  toggle: {
    width: '40px',
    height: '40px',
    backgroundColor: 'blue',
  },
};

export default class Drawer extends Component {
  state = {
    collapsed: true,
  }

  openDrawer = () => {
    this.setState({
      collapsed: false,
    });
  }

  closeDrawer = () => {
    this.setState({
      collapsed: true,
    });
  }

  stopPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { button, children } = this.props;
    const { collapsed } = this.state;

    return (
      <span onClick={this.stopPropagation} style={styles.drawer}>
        <div onClick={this.openDrawer} style={styles.button}>{button}</div>

        <div style={mergeStyles(styles, {
          sidebar: true,
          collapsed,
        })}>
          <div style={styles.toggle} onClick={this.closeDrawer} />
          <div>
            {children}
          </div>
        </div>
      </span>
    );
  }
}
