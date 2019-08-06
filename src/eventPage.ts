// Listen to messages sent from other parts of the extension.

interface TokenProps {
    access_token: string,
    expires_in: number,
    scope: string,
    token_type: string
}
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


            let YOUR_AUTHORIZATION_CODE = getQueryParam('code');
            let YOUR_CLIENT_ID = 'tmi53Gr2TISSaWud3wQ1wu7do0MNvq27';
            let YOUR_CLIENT_SECRET = 'wsEtWQh7bJ9s1wnwHjngX4azdv1jq6kcZDfCHNi1qsI5WiVVDS9N4MKQl37abfss';
            let YOUR_APP_CALLBACK_URL = 'https://nchdjmlnhfdfkmpjhjfifbacclccaaih.chromiumapp.org/';

            fetch("https://auth.atlassian.com/oauth/token", {
                body: `{\"grant_type\": \"authorization_code\",\"client_id\": \"${YOUR_CLIENT_ID}\",\"client_secret\": \"${YOUR_CLIENT_SECRET}\",\"code\": \"${YOUR_AUTHORIZATION_CODE}\",\"redirect_uri\": \"${YOUR_APP_CALLBACK_URL}\"}`,
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            })
            .then((v) => v.json())
            .then(function(data : TokenProps) {
                // do something with your data
                let ACCESS_TOKEN = data.access_token;
                let TOKEN_TYPE = data.token_type;
                let myHeaders = new Headers();
                myHeaders.append("Authorization", `${TOKEN_TYPE} ${ACCESS_TOKEN}`);
                myHeaders.append("Accept", `application/json`);

                myHeaders;
                return fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
                    headers: myHeaders
                })
            }).then((v) => {
                return v.json()
            }).then((v)=>console.log(v))
            .catch(error => console.log("error:", error));;
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