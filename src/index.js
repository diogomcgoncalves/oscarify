import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import App from './Components/App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { CookiesProvider } from 'react-cookie';

const MainApp = () => (
    <MuiThemeProvider >
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </MuiThemeProvider>
);

ReactDOM.render(<MainApp />, document.getElementById('root'));
registerServiceWorker();
