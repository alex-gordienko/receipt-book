import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FontSizeTitle } from "../../../styles/globalParams";

export const StyledAuthorizationContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 50px);
`;

export const SignupLink = styled(NavLink)`
  width: max-content;
  font-size: ${FontSizeTitle};
  text-decoration: none;
  color: black;
  width: max-content;
  white-space: nowrap;
`;