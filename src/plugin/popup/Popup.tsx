import * as React from 'react';
import './Popup.scss';
import Button from '@atlaskit/button'
import ModalDialog, {ModalTransition} from '@atlaskit/modal-dialog';
import Setting from './container/Setting';
import {ModalContainerType} from "./types/enum";
import CreateIssue from "./container/CreateIssue";
import {ModalDialogWrap} from "./container/ModalDialogWrap";

interface AppProps {

}

interface AppState {
  isLoggedIn: boolean,
  isOpen: boolean,
  projectId: string | null,
  issueTypeId: string | null,
  containerType: ModalContainerType
}

export interface SettingVO {
  projectId: string,
  issueTypeId: string
}

export default class Popup extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);
    this.state = {
      isOpen: false,
      isLoggedIn: true,
      containerType: ModalContainerType.Setting,
      projectId: null,
      issueTypeId: null,
    };
  }

  componentDidMount() {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({popupMounted: true});
  }

  readonly handleCloseModal = () => {
    this.setState({isOpen: false});
  };

  readonly handleOpenModal = () => {
    this.setState({isOpen: true});
  };

  readonly handleButtonClick = (e) => {
    ///TODO there's no way to make aouth call without api uri
    chrome.runtime.sendMessage(
        {api: null},
        (response) => {
          this.setState({isLoggedIn: true})
        });
  };

  readonly handleSettingSave = (settingVo: SettingVO) => {
    this.setState({
      projectId: settingVo.projectId,
      issueTypeId: settingVo.issueTypeId,
      containerType: ModalContainerType.CreateIssue
    }, () => {
      console.log(this.state)
    });
  };

  render() {
    const {isLoggedIn, isOpen, containerType, projectId, issueTypeId} = this.state;

    if (isLoggedIn) {
      return (
          <div className="popupContainer">
            <Button className="floatButton" onClick={this.handleOpenModal}>
              click
            </Button>
            <ModalTransition>
              {isOpen && <ModalDialogWrap type={containerType}
                                          projectId={projectId}
                                          issueTypeId={issueTypeId}
                                          onSettingSave={this.handleSettingSave}
                                          onModalClose={this.handleCloseModal} />}
            </ModalTransition>
          </div>
      );
    } else {
      return (
          <div className="popupContainer">
            <Button className="floatButton" onClick={this.handleButtonClick}>
              JIRA Login
            </Button>
          </div>
      );
    }
  }
}
