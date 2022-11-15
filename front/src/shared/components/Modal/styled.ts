import styled from 'styled-components';

export const ModalFullScreenContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: calc(100vh - 50px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
`;

export const StyledModal = styled.div<{
  type: "warning" | "accept" | "editing";
}>`
  position: fixed;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0px 10px 30px 0 rgba(127, 127, 127, 0.3);
  border: 1px solid black;
  border-radius: 10px;
  background: white;
  z-index: 5001;
`;