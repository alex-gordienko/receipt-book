import styled from 'styled-components';
import { FontSizeSubtitle } from '../../../styles/globalParams';

export const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
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

  &:hover {
    box-shadow: 14px 15px 7px -8px rgba(0, 0, 0, 0.6);
    width: 210px;
    height: 180px;
  }
`;

export const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ArticleTitle = styled.p`
  word-wrap: normal;
  width: max-content;
  text-align: center;
`;

export const ArticleShortDescription = styled(ArticleTitle)`
  max-width: 90%;
`;