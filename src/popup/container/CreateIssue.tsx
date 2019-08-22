import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button'
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import FieldTextArea, { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Form, {
    CheckboxField,
    Field,
    FormFooter,
    HelperMessage,
    ErrorMessage,
    ValidMessage
} from '@atlaskit/form';

interface AppProps {
    projectId : string | null,
    issueTypeId : string | null,
}

interface AppState {
    service : string,
    description : string,
    summary : string
}


export default class CreateIssue extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.createIssue = this.createIssue.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onDescriptionChange = (event: any) => {
        this.setState({
            description : event.target.value
        });
    };

    onSummaryChange= (event: any) => {
        this.setState({
            summary : event.target.value
        });
    };

    createIssue() {
        this.onFormSubmit();
    }

    onFormSubmit() {
        //TODO request jira api
        console.log('Create Issue : form submit');

        chrome.runtime.sendMessage({
            api: 'rest/api/3/issue',
            body : {
                "fields": {
                    "project":
                        {
                            "id": this.props.projectId
                        },
                    "summary": this.state.summary,
                    "description": this.state.description,
                    "issuetype": {
                        "id": this.props.issueTypeId
                    }
                }
            }
        }, function(response) {
            console.log(response);
        }.bind(this));
    }

    render() {
        const form = () => (
            <Form onSubmit={this.onFormSubmit}>
                {({formProps}) => (
                    <form {...formProps}>

                        <p>Enter some text then submit the form to see the response</p>
                        <Field
                            name="summary"
                            label="summary"
                            defaultValue=""
                            isRequired
                            onChange={this.onSummaryChange}
                            validate={value=> (value.length < 8 ? 'TOO_SHORT' : undefined)}>
                            {({fieldProps}) => (
                                <TextField {...fieldProps} autoComplete="off"/>
                            )}
                        </Field>

                        <FieldTextArea
                            label="description"
                            isSpellCheckEnabled={false}
                            onChange={this.onDescriptionChange}
                            required
                        />
                    </form>
                )}
                <FormFooter>
                    <ButtonGroup>
                        <Button type="submit" appearance="primary">Save</Button>
                    </ButtonGroup>
                </FormFooter>
            </Form>
        );

        return (
            <React.Fragment>

            {form()}
            </React.Fragment>

        )
    }
}
