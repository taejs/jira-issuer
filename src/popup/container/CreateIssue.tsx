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
            api: 'rest/api/3/issue/createmeta',
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
        interface FormProps {
            onSubmit : (e:React.FormEvent | any) => void,
            ref : React.RefObject<HTMLFormElement>;
            onKeyDown : (e:React.KeyboardEvent) => void
        }


        const form = () => (
            <React.Fragment>
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
                {/*<Field
                    name="서비스&메뉴"
                    label="서비스&메뉴">
                    {({fieldProps}) => (
                        <React.Fragment>
                            <Select
                                className="single-select"
                                classNamePrefix="react-select"
                                options={[
                                    { label: 'None', value: '' },
                                    { label: '[2.0] 관리자사이트', value: '10223'},
                                    { label: '[2.0] 평가자사이트', value: '10224'}
                                ]}
                                placeholder="서비스"
                                onChange={(service, action) => {
                                    if(action === 'select-option') this.setState({ service });
                                }}
                            />
                            <Select
                                className="single-select"
                                classNamePrefix="react-select"
                                options={(() => {
                                    const map = {
                                        '10223' : [{label : '냠냠', value : '20000'}],
                                        '10224' : [{label : '이력서팝업', value : '22'}]
                                    };

                                    console.log(this);
                                    return [{label: 'None', value : ''}];
                                    const {service} = this.state;
                                    console.log(service);

                                    let result = map[service] || [];
                                    result.push([{label: 'None', value : ''}])
                                    return result;
                                })()}
                                placeholder="메뉴"
                            />
                        </React.Fragment>
                    )}
                </Field>*/}
            </React.Fragment>
        )

        return (
            <Form onSubmit={this.onFormSubmit}>
                {({formProps}) => (
                    <form {...formProps}>
                        {form()}
                    </form>
                )}
                <FormFooter>
                    <ButtonGroup>
                        <Button type="submit" appearance="primary">Save</Button>
                    </ButtonGroup>
                </FormFooter>
            </Form>
        )
    }
}
