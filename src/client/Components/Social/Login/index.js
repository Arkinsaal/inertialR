import { h } from 'preact';

const styles = {
};

export default function Login({ connect }) {
  return (
    <div>
      <button onClick={connect}>Connect to Lobby</button>
    </div>
  );
}
