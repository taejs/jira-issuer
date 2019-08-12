import * as React from 'react';
import './Popup.scss';
import Button, { ButtonGroup } from '@atlaskit/button'
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Setting from './container/Setting';
import CreateIssue from './container/CreateIssue';
import {ModalContainerList} from "./types/enum";

interface AppProps {}

interface AppState {
    isLoggedIn : boolean,
    isOpen : boolean,
    currentContainer : ModalContainerList
}

export default class Popup extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.state = {
            isOpen : false,
            isLoggedIn : false,
            currentContainer : ModalContainerList.Setting
        };
        this.onModalClose = this.onModalClose.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    componentDidMount() {
        chrome.storage.local.clear();
        // Example of how to send a message to eventPage.ts.
        chrome.runtime.sendMessage({ popupMounted: true });
    }

    changeModalState(isOpen) {
        this.setState({
            isOpen : isOpen
        })
    }

    onButtonClick(e) {
        let self = this;
        ///TODO there's no way to make aouth call without api uri
        chrome.runtime.sendMessage({ api : null}, function(response) {
            console.log('test');
            self.setState({isLoggedIn : true})
        });
    }

    onModalClose(e) {
        this.changeModalState(false);
    }


    render() {
        const { isLoggedIn, isOpen } = this.state;
        const currentContainer = () => {
            const {currentContainer} = this.state;
            switch(currentContainer) {
                case ModalContainerList.Setting:
                    return <Setting/>
                case ModalContainerList.CreateIssue:
                    return <CreateIssue/>
                default:
                    throw new Error('"currentContainer" value is Empty');
            }
        }

        const LoggedInUI =
            <React.Fragment>
                <Button className="floatButton" onClick={() => {this.changeModalState(true);}}>click</Button>
                <ModalTransition>
                    {isOpen && <ModalDialog
                        onClose={this.onModalClose}
                        autoFocus={true}
                        components={{
                            Container : ({ children, className }) => currentContainer()
                        }}>
                    </ModalDialog>}
                </ModalTransition>
            </React.Fragment>;

        const LoginUI =
            <Button className="floatButton" onClick={this.onButtonClick}>JIRA Login</Button>;

        return (
            <div className="popupContainer">
                {isLoggedIn ? LoggedInUI : LoginUI}
            </div>
        )
    }
}
