import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';

function toggle(){
    if(app.style.display === "none"){
        app.style.display = "block";
    }else{
        app.style.display = "none";
    }
}

// ReactDOM.render(<Popup />, document.getElementById('popup'));
const app = document.createElement('div');

//app.style.display = "none";
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_browser_action") {
            toggle();
        }
    }
);

app.id = "my-extension-root";
console.log('----------------'+document.body);
document.body.appendChild(app);
ReactDOM.render(<Popup />, app);
