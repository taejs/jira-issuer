import * as React from 'react';
import './Popup.scss';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import ModalIssueCreate from "./ModalIssueCreate";

interface AppProps {}

interface AppState {
    isOpen : boolean
}

export default class Popup extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.state = {
            isOpen : false
        };
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
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
        this.changeModalState(true);
    }

    onModalClose(e) {
        this.changeModalState(false);
    }

    render() {
        const { isOpen } = this.state;
        return (
            <div className="popupContainer">
                Hello, world!
                <Button className="floatButton" onClick={this.onButtonClick}>click</Button>
                <ModalTransition>
                    {isOpen && <ModalIssueCreate onClose={this.onModalClose} />}
                {isOpen && <ModalDialog heading="Hi there 👋" onClose={this.onModalClose} autoFocus={true} />}
                </ModalTransition>
            </div>
        )
    }
}
