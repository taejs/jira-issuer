import {TokenProps} from "../model";

export function getAccessToken(request, sender, sendResponse) {
  return new Promise(function(resolve, reject) {
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
          let myHeaders = new Headers();
          let CLOUD_ID;
          let ACCESS_TOKEN;
          let TOKEN_TYPE;
          let DOMAIN;

          fetch("https://auth.atlassian.com/oauth/token", {
            /*body: JSON.stringify(
                {
                  grant_type: "~~~~"
                }
            ),*/
            body: `{\"grant_type\": \"authorization_code\",\"client_id\": \"${YOUR_CLIENT_ID}\",\"client_secret\": \"${YOUR_CLIENT_SECRET}\",\"code\": \"${YOUR_AUTHORIZATION_CODE}\",\"redirect_uri\": \"${YOUR_APP_CALLBACK_URL}\"}`,
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST"
          })
              .then((v) => v.json())
              .then(function(data : TokenProps) {
                // do something with your data
                ACCESS_TOKEN = data.access_token;
                TOKEN_TYPE = data.token_type;
                myHeaders.append("Authorization", `${TOKEN_TYPE} ${ACCESS_TOKEN}`);
                myHeaders.append("Accept", `application/json`);

                return fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
                  headers: myHeaders
                })
              }).then((v) => v.json())
              .then((data)=>{
                CLOUD_ID = data[0].id;
                DOMAIN = data[0].url;
                chrome.storage.local.set({
                  "ACCESS_TOKEN": ACCESS_TOKEN,
                  "TOKEN_TYPE" : TOKEN_TYPE,
                  "CLOUD_ID" : CLOUD_ID,
                  "DOMAIN" : DOMAIN
                }, function() {
                  resolve({ACCESS_TOKEN, TOKEN_TYPE, CLOUD_ID, DOMAIN});
                });
              })
          //TODO refactor to async/await

          return true; //mean to send response asynchronously
        });
  });
}