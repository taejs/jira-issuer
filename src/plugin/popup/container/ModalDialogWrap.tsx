import * as React from "react";
import ModalDialog from "@atlaskit/modal-dialog/dist/cjs/components/ModalWrapper";
import {ModalContainerType} from "../types/enum";
import Setting from "./Setting";
import CreateIssue from "./CreateIssue";
import {SettingVO} from "../Popup";

interface Props {
  type: ModalContainerType;

  projectId: string | null,
  issueTypeId: string | null,

  onSettingSave(settingVo: SettingVO)

  onModalClose(value: boolean);
}

interface State {

}

export class ModalDialogWrap extends React.Component<Props, State> {
  readonly handleModalClose = (e) => {
    this.props.onModalClose(false);
  };

  readonly handleSettingSave = (vo: SettingVO) => {
    this.props.onSettingSave(vo);
  };

  private readonly actions = [
    {text: 'Close', onClick: this.handleModalClose}
  ];

  render() {
    return (
        <ModalDialog
            autoFocus
            heading={"hi there"}
            height={"100%"}
            onClose={this.handleModalClose}
            actions={this.actions}
            components={{
              Body: React.forwardRef<HTMLDivElement,
                  React.AllHTMLAttributes<HTMLDivElement>>(this.handleRenderBody)
            }}>
        </ModalDialog>
    );
  }

  readonly handleRenderBody = (props, ref) => {
    return (
        <div ref={ref} {...props}>
          {this.renderBodyContent()}
        </div>
    );
  };

  renderBodyContent() {
    switch (this.props.type) {
      case ModalContainerType.Setting:
        return <Setting onSettingSave={this.handleSettingSave}/>;
      case ModalContainerType.CreateIssue:
        const {issueTypeId, projectId} = this.props;
        return <CreateIssue issueTypeId={issueTypeId} projectId={projectId} />;
    }
    return null;
  }
}