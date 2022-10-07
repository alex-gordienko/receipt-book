import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontSizeSubheader } from '../../../styles/globalParams';

export const CategoriesTreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

export const CategoriesTreeBlock = styled.div`
  border: 1px solid black;
  border-radius: 20px;
  height: 100%;
  width: max-content;
  max-width: 40vh;
  margin: 20px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 15px 10px rgba(0, 0, 0, 0.1) inset;
`;

export const CategoryTopBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

export const CategoryTitle = styled.p`
  font-size: ${FontSizeSubheader};
  text-align: center;
`;

export const CategoriesTreeContent = styled.div`
  height: calc(100vh - 150px);
  overflow-y: scroll;
`;

export const Category = styled.div<{level: number}>`
  width: auto;
  margin: 0.25rem 0 0.25rem 0; 
  margin-left: calc(${props => props.level} * 5px);
`;

export const CategoryLabel = styled(Link)`
  text-decoration: none;
  color: black;
  width: max-content;
  border-left: 1px solid;
  border-bottom: 1px dashed;
  padding-left: 5px;
`;