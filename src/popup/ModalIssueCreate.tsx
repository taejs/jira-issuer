import * as React from 'react';
import './Popup.scss';
import Button, { ButtonGroup } from '@atlaskit/button'
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Form, { Field, CheckboxField } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';

interface AppProps {
    onClose : (e : any) => void
}

interface AppState {
}


export default class ModalIssueCreate extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.createIssue = this.createIssue.bind(this);
    }

    createIssue() {
        this.onFormSubmit();
    }

    onFormSubmit() {
        //TODO request jira api
        console.log('form submit');
    }

    render() {
        interface FormProps {
            onSubmit : (e:React.FormEvent | any) => void,
            ref : React.RefObject<HTMLFormElement>;
            onKeyDown : (e:React.KeyboardEvent) => void
        }

        const actions = [
            { text : 'Create Issue' , onClick : this.createIssue },
            { text : 'Close', onClick : this.props.onClose }
        ]

        const { onClose } = this.props;
        return (
            <ModalDialog
                actions={actions}
                heading="Hi there 👋"
                onClose={onClose}
                autoFocus={true}
                components={{
                    Container : (children, className) => (
                        <Form onSubmit={this.onFormSubmit}>
                            {({formProps} : {formProps : FormProps}) => {
                                <form className={className} {...formProps}>
                                    {children}
                                </form>
                            }}
                        </Form>
                    )
                }}
                >
                <p>Enter some text then submit the form to see the response</p>
                <Field label="iss"/>
            </ModalDialog>
        )
    }
}
