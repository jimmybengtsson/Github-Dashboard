import React from 'react';
import ReactDOM from 'react-dom';
import './components/App/App.css';
import App from './components/App/App';
import registerServiceWorker from './components/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
