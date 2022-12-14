import styled from 'styled-components';
import { FontSizeSubtitle } from '../../../styles/globalParams';

export const ReceiptContainer = styled.div`
  display: flex;
  width: 200px;
  height: 170px;
  border: 1px solid;
  border-radius: 20px;
  margin: 15px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all .6s;
  font-size: ${FontSizeSubtitle};
  flex-direction: column;

  &:hover {
    box-shadow: 14px 15px 7px -8px rgba(0, 0, 0, 0.6);
    width: 210px;
    height: 180px;
  }
`;

export const ReceiptsContent = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: center;
`;

export const ReceiptTitle = styled.p`
  word-wrap: normal;
  width: min-content;
  text-align: center;
`;