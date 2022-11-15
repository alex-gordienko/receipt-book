import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FontSizeTitle } from "../../../styles/globalParams";

export const StyledHeader = styled.div`
  width: 100%;
  border: 1px solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
`;

export const StyledBlock = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-around;
  margin: 0 15px;
  align-items: center;
`;

export const LoginLink = styled(NavLink)`
  width: max-content;
  font-size: ${FontSizeTitle};
  text-decoration: none;
  color: black;
  width: max-content;
  padding-left: 5px;
  white-space: nowrap;
`;