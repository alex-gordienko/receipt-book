import styled from 'styled-components';
import { FontSizeTitle, FontSizeHeader } from '../../../styles/globalParams';

export const ReaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const ReaderContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 60%;
  border: 1px solid;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 20px 17px 3px rgba(0, 0, 0, 0.3);
`;

export const ReaderContentBlockTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  height: 40px;
`;

export const ReaderContentBlockButtonContainer = styled.div`
  display: flex;

  div:first-child {
    margin-right: 10px;
  }
`;

export const ReaderContentBlockTitle = styled.p`
  font-size: ${FontSizeHeader};
  margin: 0;
  text-align: center;
`;

export const ReaderContentBlockContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  max-height: calc(100% - 145px);
  justify-content: space-between;
  flex: 1;
  margin: 20px 0;
`;

export const ReaderContentBlockTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ReaderContentBlockContentImage = styled.img`
  width: 30vw;
  height: 30vh;
`;

export const ReaderContentBlockContentText = styled.div`
  min-height: 50px;  
  overflow-y: scroll;
  margin: 10px;
`;

export const ArticleLikesBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-evenly;
`;

export const LikesCounter = styled.p`
  margin: 5px;
  font-size: ${FontSizeTitle};
`;
