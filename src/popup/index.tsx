import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    ReactDOM.render(<Popup />, document.getElementById('popup'));
    // const app = document.createElement('div');
    // app.id = "my-extension-root";
    // document.body.appendChild(app);
    // ReactDOM.render(<Popup />, app);
});
