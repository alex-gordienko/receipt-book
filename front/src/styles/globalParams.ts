import styled from 'styled-components';

export const FontSizeHeader = '1.5rem';
export const FontSizeSubheader = '1.20rem';
export const FontSizeTitle = '1rem';
export const FontSizeSubtitle = '.75rem';

export const ButtonBase = styled.div<{disabled?: boolean}>`
  cursor: pointer;
  border: 1px solid;
  border-radius: 10px;
  padding: 10px;
  background: #EBEBEB;
  transition: .6s ease all;

  &:hover {
    background: #757575;
    box-shadow: 0px 10px 5px 1px rgba(0, 0, 0, 0.3);
  }
`;

export const EditButton = styled(ButtonBase)`
  background: #FFE9A8;
  &:hover {
    background: #FFD351;
  }
`;

export const DeleteButton = styled(ButtonBase)`
  background: #FF9D9D;
  &:hover {
    background: #FF3B3B;
  }
`;

export const OKButton = styled(ButtonBase)`
  background: #66E275;
  &:hover {
    background: #259433;
  }
`;

export const CancelButton = styled(ButtonBase)`
  background: #FFE9A8;
  &:hover {
    background: #FFD351;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  height: min-content;

  div {
    margin-right: 10px;
  }

  div:last-child {
    margin: 0;
  }
`;