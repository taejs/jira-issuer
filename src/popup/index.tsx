import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';
import './index.scss';

//app.style.display = "none";
/*chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action") {
            app.classList.toggle('hide');
        }
    }
);*/

const app = document.createElement('div');
//app.classList.add('hide');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Popup />, app);
