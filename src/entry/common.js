import ReactDOM from 'react-dom';
import App from '@/components/App';

export function appInit() {
  const appRoot = window.document.getElementById('app-root');

  ReactDOM.render(<App />, appRoot);
}
