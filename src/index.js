import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import App from './Components/App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const MainApp = () => (
    <MuiThemeProvider >
        <App />
    </MuiThemeProvider>
);

ReactDOM.render(<MainApp />, document.getElementById('root'));
registerServiceWorker();
