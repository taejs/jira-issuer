import * as React from 'react';
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Form, { Field } from '@atlaskit/form';
import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import {KeyboardOrMouseEvent} from "@atlaskit/modal-dialog/types";

interface AppProps {
    onClose : (event: KeyboardOrMouseEvent) => void
}

interface AppState {
    isOpen : boolean
}

export default class ModalIssueCreate extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    render() {
        const { onClose } = this.props;
        return (
            <ModalDialog heading="Hi there 👋" onClose={onClose} autoFocus={true} />
        )
    }
}
