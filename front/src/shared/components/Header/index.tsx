import React, { useContext } from "react";
import { AppContext } from '../../../store';
import { logoutUser } from "../../../store/actions";
import { StyledHeader, StyledBlock, LoginLink } from "./styled";


const Header: React.FC<{}> = () => {
  const { state, dispatch } = useContext(AppContext);

  const renderHeaderBody = () => {
    const loginLink = state.isAdmin ? '/admin/login' : '/login';

    const handleLogoutClick = () => {
      logoutUser(dispatch);
    }
    if (!state.user) {
      return (
        <StyledBlock>
          <p>Welcome, guest</p>
          <LoginLink to={loginLink}>Login</LoginLink>
        </StyledBlock>
      )
    }
    return (
      <StyledBlock>
        <p>Welcome, {state.user.firstname}</p>
        <LoginLink to={loginLink} onClick={handleLogoutClick}>Log out</LoginLink>
      </StyledBlock>
    )
  }

  return (
    <StyledHeader>
      {renderHeaderBody()}
    </StyledHeader>
  )
}

export default Header