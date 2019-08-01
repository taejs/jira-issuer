import * as React from 'react';
import './Popup.scss';
import Button, { ButtonGroup } from '@atlaskit/button'
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Form, { Field, CheckboxField } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';


interface AppProps {
    onClose : (e : any) => void
}

interface AppState {
    service : string
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
                <Field
                    name="summary"
                    label="summary"
                    defaultValue=""
                    isRequired
                    validate={value=> (value.length < 8 ? 'TOO_SHORT' : undefined)}>
                    <TextField autoComplete="off"/>
                </Field>
                <Field
                    name="서비스&메뉴"
                    label="서비스&메뉴">
                    <Select
                        className="single-select"
                        classNamePrefix="react-select"
                        options={[
                        { label: 'None', value: '' },
                        { label: '[2.0] 관리자사이트', value: '10223'},
                        { label: '[2.0] 평가자사이트', value: '10224'}
                        ]}
                        placeholder="서비스"
                        onChange={service => this.setState({ service })}
                    />
                    <Select
                        className="single-select"
                        classNamePrefix="react-select"
                        options={() => {
                            const map = {
                                '10223' : [{label : '냠냠', value : '20000'}],
                                '10224' : [{label : '이력서팝업', value : '22'}]
                            }
                            const {service} = this.state;
                            return map[service] || [];
                        }}
                        placeholder="메뉴"
                    />
                </Field>
            </ModalDialog>
        )
    }
}
