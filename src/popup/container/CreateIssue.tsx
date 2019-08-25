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
        console.log(props);
        this.createIssue = this.createIssue.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onSummaryChange = this.onSummaryChange.bind(this);
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
        const {summary, description} = this.state;
        const {issueTypeId} = this.props;

        chrome.runtime.sendMessage({
            api: 'rest/api/3/issue',
            body : JSON.stringify({
                "fields": {
                    "summary": summary || '-',
                    "description": description,
                    "issuetype": {
                        "id": issueTypeId
                    }
                }
            })
        }, function(response) {
            console.log(response);
        });
    }

    render() {
        const form = () => (
            <Form onSubmit={this.onFormSubmit}>
                {({ formProps, submitting }) => (
                    <form {...formProps}>
                        {/*<Field
                            name="summary"
                            label="summary"
                            defaultValue=""
                            isRequired
                            onChange={this.onSummaryChange}
                            validate={value=> (value.length < 8 ? 'TOO_SHORT' : undefined)}>
                            {({ fieldProps, error, meta: { valid } }) => (
                                <TextField {...fieldProps} autoComplete="off"/>
                            )}
                        </Field>*/}

                        <FieldTextArea
                            label="description"
                            isSpellCheckEnabled={false}
                            onChange={this.onDescriptionChange}
                            required
                        />
                        <FormFooter>
                            <ButtonGroup>
                                <Button type="submit" appearance="primary">Save</Button>
                            </ButtonGroup>
                        </FormFooter>
                    </form>
                )}
            </Form>
        );

        return (
            <React.Fragment>

            {form()}
            </React.Fragment>

        )
    }
}
