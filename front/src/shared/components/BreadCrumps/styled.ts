import styled from "styled-components";
import { Link } from 'react-router-dom';
import { FontSizeSubtitle } from "../../../styles/globalParams";

export const BreadCrumpsContainer = styled.div`
  width: 100%;
  min-height: 30px;
  max-width: 70vw;
  overflow-x: scroll;
  display: flex;
  align-items: center;
  margin-top: 20px;

  a::after {
    content: ' / '
  }
  a:last-child::after {
    content: ''
  }
`;

export const BreadCrump = styled(Link)`
  width: max-content;
  font-size: ${FontSizeSubtitle};
  text-decoration: none;
  color: black;
  width: max-content;
  padding-left: 5px;
  white-space: nowrap;
`;