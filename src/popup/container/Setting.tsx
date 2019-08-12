import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button'
import ModalDialog, { ModalTransition } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import Select from '@atlaskit/select';

interface AppProps {}

interface AppState {
    isLoaded : boolean,
    projects : ProjectIssueCreateMetadata[]
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
export default class Popup extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.state = {
            isLoaded : false,
            projects : null
        };
    }

    updateIsLoaded = () => {this.setState({ isLoaded : true })};

    componentDidMount() {
        chrome.runtime.sendMessage({ api: 'rest/api/3/issue/createmeta'}, function(response : CreateMetaProps) {
            this.setState({
                projects : response.json.projects
            })
            this.updateIsLoaded();
        }.bind(this));
    }

    render() {
        let {isLoaded} = this.state;
        const Form = <div>
            <Select
                options={this.state.projects.map((v)=>{return {label : v['name'], value : v['id'], avatar : v['avatarUrls']['16x16']}})}
                components={{
                    Option: ({ children, innerProps }) => (
                        <div className="custom-option" {...innerProps}>
                            <img src={innerProps['avatar']} />
                            {children}
                        </div>
                    )
                }}/>

        </div>;
        return (
            <div className="popupContainer">
                {isLoaded ? <Spinner
                    delay={0}
                    invertColor={false}
                    size="large"
                    onComplete={()=>{}}
                    isCompleting={isLoaded}
                /> : Form }
            </div>
        )
    }
}
