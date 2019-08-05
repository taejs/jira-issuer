// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;

    if (request.popupMounted) {
        console.log('eventPage notified that Popup.tsx has mounted.');
    } else if(request.oauth) {
        chrome.identity.launchWebAuthFlow(
        {'url': 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=tmi53Gr2TISSaWud3wQ1wu7do0MNvq27&scope=read%3Ajira-user%20manage%3Ajira-project%20manage%3Ajira-configuration%20write%3Ajira-work%20read%3Ajira-work%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Fnchdjmlnhfdfkmpjhjfifbacclccaaih.chromiumapp.org%2F&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent', 'interactive': true},
        function(redirect_url) {
            /* Extract token from redirect_url */
            //https://nchdjmlnhfdfkmpjhjfifbacclccaaih.chromiumapp.org/?code=Lx5CLcWHu325IIaK&state=%24%7BYOUR_USER_BOUND_VALUE%7D
            console.log(redirect_url);

            const getQueryParam = function(name) {
                var q = redirect_url.match(new RegExp('[?&]' + name + '=([^&#]*)'));
                return q && q[1];
            }

            let ACCESS_TOKEN = getQueryParam('code');

            fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            }).then((v) => {
                console.log(v);
                console.log(v.json());
            })
        });
    }

    return isResponseAsync;
});

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow:true},
        function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id,
                {"message": "clicked_browser_action"}
            );
        });
});