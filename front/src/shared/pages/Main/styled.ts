import styled from 'styled-components';
import { FontSizeHeader } from '../../../styles/globalParams';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

export const MainRightBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const MainRightBlockTopHeader = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  align-content: center;

`;

export const MainRightBlockTitle = styled.p`
  font-size: ${FontSizeHeader};
  text-align: center;
`;

export const MainRightBlockContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  max-height: calc(100vh - 185px);
  justify-content: space-between;
  flex: 1;
  margin: 20px 0;
`