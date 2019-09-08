// Listen to messages sent from other parts of the extension.
import {RequestHeaders} from "../model";
import {getAccessToken} from "./token";

chrome.storage.local.clear();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.hasOwnProperty('api')) {
        chrome.storage.local.get(['ACCESS_TOKEN', 'TOKEN_TYPE', 'CLOUD_ID', 'DOMAIN'], function(items) {
            var callApi = function(api, ACCESS_TOKEN, TOKEN_TYPE, CLOUD_ID, DOMAIN) {
                let myHeaders = new Headers();
                let myBody = request.body? JSON.stringify(request.body) : null;

                myHeaders.append("Authorization", `${TOKEN_TYPE} ${ACCESS_TOKEN}`);
                myHeaders.append("Accept", `application/json`);
                myHeaders.append("Content-Type", `application/json`);

                fetch(myBody ? `https://api.atlassian.com/ex/jira/${CLOUD_ID}/${request.api}`
                    : `${DOMAIN}/${request.api}`, {
                    headers : myHeaders,
                    body : myBody,
                    method: myBody ? 'POST' : 'GET'
                }).then(v => v.json())
                    .then(v=> {
                        chrome.storage.local.set({ "ACCESS_TOKEN": ACCESS_TOKEN }, function(){
                            sendResponse({
                                json: v
                            })
                        });
                    })
                    .catch(error => console.log("error:", error));
                //TODO refactor to async/await
            };

            let api = request.api;
            let {ACCESS_TOKEN, TOKEN_TYPE, CLOUD_ID, DOMAIN} = items;

            if(api === null) {
                if(!items || !items.ACCESS_TOKEN) {
                    getAccessToken(request, sender, sendResponse).then((result: RequestHeaders) => {
                        sendResponse(result);
                    })
                } else sendResponse(items);
            }
            else if(!items || !items.ACCESS_TOKEN) {
                getAccessToken(request, sender, sendResponse).then((result: RequestHeaders) => {
                    let {ACCESS_TOKEN, TOKEN_TYPE, CLOUD_ID, DOMAIN} = result;
                    callApi(api, ACCESS_TOKEN, TOKEN_TYPE, CLOUD_ID, DOMAIN);
                })
            }
            else callApi(api, ACCESS_TOKEN, TOKEN_TYPE, CLOUD_ID, DOMAIN);
        });
    }

    // onMessage must return "true" if response is async.
    return true;
});

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true},
        function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id,
                {"message": "clicked_browser_action"}
            );
        });
});