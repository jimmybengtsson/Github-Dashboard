import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './views/App';
import registerServiceWorker from './components/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
