import * as React from 'react';
import './Popup.scss';
import Button from '@atlaskit/button'
import ModalDialog, {ModalTransition} from '@atlaskit/modal-dialog';
import Setting from './container/Setting';
import {ModalContainerList} from "./types/enum";

interface AppProps {}

interface AppState {
    isLoggedIn : boolean,
    isOpen : boolean,
    projectId : string | null,
    issueTypeId : string | null,
    currentContainer : ModalContainerList
}

interface SettingVO {
    projectId : string,
    issueTypeId : string
}
export default class Popup extends React.Component<AppProps, AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
        this.state = {
            isOpen : false,
            isLoggedIn : true,
            currentContainer : ModalContainerList.Setting,
            projectId : null,
            issueTypeId : null,
        };
        this.onModalClose = this.onModalClose.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
        this.changeModalState = this.changeModalState.bind(this);
        this.onSettingSave = this.onSettingSave.bind(this);
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

    onSettingSave(settingVo : SettingVO){
        this.setState({
            projectId : settingVo.projectId,
            issueTypeId : settingVo.issueTypeId,
            currentContainer : ModalContainerList.CreateIssue
        });
    }

    render() {
        const { isLoggedIn, isOpen } = this.state;
        const currentContainer = (props, ref) => {
            const {currentContainer} = this.state;
            switch(currentContainer) {
                case ModalContainerList.Setting:
                    return <div ref={ref} {...props}><Setting onSettingSave={this.onSettingSave}></Setting></div>
                /*case ModalContainerList.CreateIssue:
                    return <div ref={ref} {...props}><CreateIssue></CreateIssue></div>*/
                default:
                    return <div ref={ref} {...props}></div>;
            }
        }

        const LoggedInUI =
            <React.Fragment>
                <Button className="floatButton" onClick={() => {this.changeModalState(true);}}>click</Button>
                <ModalTransition>
                    {isOpen && <ModalDialog
                        heading="hi there"
                        height="100%"
                        onClose={this.onModalClose}
                        autoFocus={true}
                        actions={[
                            { text: 'Close', onClick: ()=>{this.changeModalState(false)}}
                        ]}
                        components={{
                            Body : React.forwardRef<
                                HTMLDivElement,
                                React.AllHTMLAttributes<HTMLDivElement>
                                >((props, ref) => {
                                    return currentContainer(props, ref);
                            })
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
