import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button'
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import Select from '@atlaskit/select';
import Form, {Field} from '@atlaskit/form'
interface AppProps {}

interface AppState {
    isLoaded : boolean,
    projects : any
//    projects : ProjectIssueCreateMetadata[]
}

interface IssueType {
    self : string,
    id  : string,
    description : string,
    iconUrl : string,
    name : string,
    subtask :boolean,
    avatarId : number,
    entityId : string,
    scope : object,
    expand : string,
    fields : object
}
interface ProjectIssueCreateMetadata {
    expand: string,
    self : string,
    id : string,
    key : string,
    name : string,
    avatarUrls : object,
    issuetypes : IssueType[]
}
interface CreateMetaJson {
    projects : ProjectIssueCreateMetadata[],
    expand? : string
}

interface CreateMetaProps {
    json : CreateMetaJson
}

class SettingFooter extends React.Component {
    constructor(props, state) {
        super(props, state);
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}
export default class Setting extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.state = {
            isLoaded : false,
            projects : [
                {
                    "expand": "issuetypes",
                    "self": "http://kelpie9:8081/rest/api/2/project/QA",
                    "id": "10010",
                    "key": "QA",
                    "name": "QA",
                    "avatarUrls": {
                        "16x16": "http://kelpie9:8081/secure/projectavatar?size=small&pid=10010&avatarId=10011",
                        "48x48": "http://kelpie9:8081/secure/projectavatar?pid=10010&avatarId=10011"
                    },
                    "issuetypes": [
                        {
                            "expand": "fields",
                            "self": "http://kelpie9:8081/rest/api/2/issuetype/1",
                            "id": 1,
                            "name": "Bug",
                            "iconUrl": "http://kelpie9:8081/images/icons/bug.gif",
                            "fields": {
                                "summary": {
                                    "required": true,
                                    "schema": {
                                        "type": "string",
                                        "system": "summary"
                                    },
                                    "operations": [
                                        "set"
                                    ]
                                },
                                "timetracking": {
                                    "required": false,
                                    "operations": []
                                },
                                "issuetype": {
                                    "required": true,
                                    "schema": {
                                        "type": "issuetype",
                                        "system": "issuetype"
                                    },
                                    "operations": [],
                                    "allowedValues": [
                                        {
                                            "id": "1",
                                            "name": "Bug",
                                            "description": "A problem which impairs or prevents the functions of the product.",
                                            "iconUrl": "http://kelpie9:8081/images/icons/bug.gif"
                                        }
                                    ]
                                },
                                "customfield_10080": {
                                    "required": false,
                                    "schema": {
                                        "type": "array",
                                        "items": "string",
                                        "custom": "com.atlassian.jira.plugin.system.customfieldtypes:labels",
                                        "customId": 10080
                                    },
                                    "operations": []
                                },
                                "customfield_10010": {
                                    "required": false,
                                    "schema": {
                                        "type": "array",
                                        "items": "string",
                                        "custom": "com.atlassian.jira.plugin.system.customfieldtypes:labels",
                                        "customId": 10010
                                    },
                                    "operations": []
                                },
                                "customfield_10071": {
                                    "required": false,
                                    "schema": {
                                        "type": "array",
                                        "items": "string",
                                        "custom": "com.atlassian.jira.plugin.system.customfieldtypes:textfield",
                                        "customId": 10071
                                    },
                                    "operations": []
                                }
                            }
                        }]
                }
            ]
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit() {
        /**/
    }

    componentDidMount() {
        /*chrome.runtime.sendMessage({ api: 'rest/api/3/issue/createmeta'}, function(response : CreateMetaProps) {
            this.setState({
                projects : response.json.projects
            })
            this.updateIsLoaded();
        }.bind(this));*/
    }

    render() {
        let {isLoaded} = this.state;
        const renderForm =
            <Form onSubmit={this.onFormSubmit}>
                <p>Enter some text then submit the form to see the response.</p>
                <Field label="Failed Select" name="fail-city" >
                {/*<Field label="Failed Select" name="fail-city" validate={validate}>*/}
                    {({ fieldProps, error, meta: { valid } }) => (
                        <React.Fragment>
                            <Select
                                {...fieldProps}
                                options={this.state.projects.map((v)=>{return {label : v['name'], value : v['id'], avatar : v['avatarUrls']['16x16']}})}
                                placeholder="Choose a City"
                                //validationState={getValidationState(error, valid)}
                            />
                           {/* {error === 'EMPTY' && <ErrorMessage>{errorMsg}</ErrorMessage>}*/}
                        </React.Fragment>
                    )}
                </Field>
            </Form>;
        return (
            <div className="popupContainer">
                {/*{isLoaded ? <Spinner
                    delay={0}
                    invertColor={false}
                    size="large"
                    onComplete={()=>{}}
                    isCompleting={isLoaded}
                /> : renderForm }*/}
                왜안되냐말
            </div>
        )
    }
}
