import styled from "styled-components";

export const PaginationContainer = styled.nav`
  display: flex;
  justify-content: center;
`;

export const PaginationBlock = styled.ul`
  width: max-content;
  max-width: 70%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  padding: 0;
`;

export const CallPageButton = styled.div`
  border: 1px solid grey;
  height: 20px;
  width: max-content;
  cursor: pointer;
  padding: 5px;
  border-radius: 10px;
`;

export const PaginationButton = styled.li<{ selected: boolean }>`
  color: ${props=> props.selected ? 'red' : 'black'};
  width: 30px;
  height: 30px;
  border: 1px solid ${props=> props.selected ? 'red' : 'grey'};
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  margin: 5px;
  cursor: pointer;
`;