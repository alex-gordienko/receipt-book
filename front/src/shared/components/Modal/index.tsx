import React, { FC } from "react";
import { ButtonContainer, OKButton, CancelButton } from "../../../styles/globalParams";

import { StyledModal, ModalFullScreenContainer } from "./styled";

interface IModalProps {
  show: boolean;
  type: "warning" | "accept" | "editing";
  name: string;
  children: JSX.Element;
  isDisabled?: boolean;
  onOK: () => void;
  onCancel?: () => void;
}

const Modal: FC<IModalProps> = (props: IModalProps) => {
  const onOutsideFormClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget && props.onCancel) {
      return props.onCancel();
    }
  };

  return (
    <React.Fragment>
      {props.show && (
        <ModalFullScreenContainer onClick={onOutsideFormClick}>
          <StyledModal type={props.type}>
            <h1>{props.name}</h1>
            <div className="content">{props.children}</div>
            <ButtonContainer>
              <OKButton disabled={props.isDisabled} onClick={() => !props.isDisabled && props.onOK()}>OK</OKButton>
              {props.onCancel && (
                <CancelButton onClick={props.onCancel}>Cancel</CancelButton>
              )}
            </ButtonContainer>
          </StyledModal>
        </ModalFullScreenContainer>
      )}
    </React.Fragment>
  );
};

export default Modal;