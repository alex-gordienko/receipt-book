import styled from "styled-components";
import { FontSizeSubheader } from "../../../styles/globalParams";

export const ListComponentContainer = styled.div`
  border: 1px solid black;
  border-radius: 20px;
  height: 100%;
  width: 100%;
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 15px 10px rgba(0, 0, 0, 0.1) inset;
`;

export const TopBlock = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-content: center;
  align-items: center;
`;

export const ListTitle = styled.p`
  text-align: center;
  font-size: ${FontSizeSubheader};
`;

export const ListData = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;