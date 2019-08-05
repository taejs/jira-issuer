import * as React from 'react';
import './Popup.scss';
import Button, { ButtonGroup } from '@atlaskit/button'
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import ModalIssueCreate from "./ModalIssueCreate";

interface AppProps {}

interface AppState {
    isLoggedIn : boolean,
    isOpen : boolean
}

export default class Popup extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.state = {
            isOpen : false,
            isLoggedIn : false
        };
        this.onModalClose = this.onModalClose.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    componentDidMount() {
        // Example of how to send a message to eventPage.ts.
        chrome.runtime.sendMessage({ popupMounted: true });
    }

    changeModalState(isOpen) {
        this.setState({
            isOpen : isOpen
        })
    }

    onButtonClick(e) {

        chrome.identity.launchWebAuthFlow(
            {'url': 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=tmi53Gr2TISSaWud3wQ1wu7do0MNvq27&scope=read%3Ajira-user%20manage%3Ajira-project%20manage%3Ajira-configuration%20write%3Ajira-work%20read%3Ajira-work%20manage%3Ajira-data-provider&redirect_uri=https%3A%2F%2Fwww.atlassian.com%2Frobots.txt&state=${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent', 'interactive': true},
            function(redirect_url) {
                /* Extract token from redirect_url */
                console.log(redirect_url);
            });
    }

    onModalClose(e) {
        this.changeModalState(false);
    }


    render() {
        const { isLoggedIn, isOpen } = this.state;
        const LoggedInUI =
            <React.Fragment>
                <Button className="floatButton" onClick={() => {this.changeModalState(true);}}>click</Button>
                <ModalTransition>
                    {isOpen && <ModalIssueCreate onClose={this.onModalClose} />}
                </ModalTransition>
            </React.Fragment>;

        const LoginUI =
            <Button onClick={this.onButtonClick}>JIRA Login</Button>;

        return (
            <div className="popupContainer">
                {isLoggedIn ? LoggedInUI : LoginUI}
            </div>
        )
    }
}
