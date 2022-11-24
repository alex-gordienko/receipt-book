import React, { useState, useContext } from 'react';
import { AppContext } from '../../../store';
import { saveToken, setServerError } from '../../../store/actions';
import { EditorContainer, EditorRow, EditorRowName, EditorRowValue } from '../../../styles/globalParams';
import Modal from '../../components/Modal';
import { isRequestError, login, signupUser } from '../../helpers/httpConnector';
import { StyledAuthorizationContainer, SignupLink } from './styled';


interface IAuthorization {
  mode: 'Authorization' | 'Registration'
}

const Authorization: React.FC<IAuthorization> = (props) => {
  const { state, dispatch } = useContext(AppContext);

  const [account, setAccount] = useState<user.IAuthorizeData>({login: '', pass: ''});
  const [user, setUser] = useState<user.ICreateUser>({login: '', pass: '', firstname: '', lastname: '', phone: '', email: ''});

  const sendUserData = async () => {
    console.log(props.mode, account, user);
    if (props.mode === 'Authorization') {
      try {
        const result = await login(account.login, account.pass);
        saveToken(dispatch, result.token);
        window.location.replace(state.isAdmin ? '/admin' : '/');
      } catch (error) {
        console.error(error);
        setServerError(dispatch, { errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
      }
    }
    if (props.mode === 'Registration') {
      try {
        const result = await signupUser(user);
        saveToken(dispatch, result.token);
        window.location.replace(state.isAdmin ? '/admin' : '/');
      } catch (error) {
        console.error(error);
        setServerError(dispatch, { errors: isRequestError(error) ? [error.message] : [JSON.stringify(error)] })
      }
    }
  }

  const renderModal = () => {
    if (props.mode === 'Authorization') {
      return (
        <>
          <EditorRow>
            <EditorRowName>Login</EditorRowName>
            <EditorRowValue value={account?.login} onChange={(event) => setAccount({ ...account, login: event.currentTarget.value })}/>
          </EditorRow>
          <EditorRow>
            <EditorRowName>Password</EditorRowName>
            <EditorRowValue value={account?.pass} onChange={(event) => setAccount({ ...account, pass: event.currentTarget.value })}/>
          </EditorRow>
          <EditorRow>
            <SignupLink to={state.isAdmin ? '/admin/signup' : '/signup'}>New User? Sign up</SignupLink>
          </EditorRow>
        </>
      )
    }
    return (
      <>
        <EditorRow>
          <EditorRowName>Login</EditorRowName>
          <EditorRowValue value={user?.login} onChange={(event) => setUser({ ...user, login: event.currentTarget.value })}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Password</EditorRowName>
          <EditorRowValue value={user?.pass} onChange={(event) => setUser({ ...user, pass: event.currentTarget.value })}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Firstname</EditorRowName>
          <EditorRowValue value={user?.firstname} onChange={(event) => setUser({ ...user, firstname: event.currentTarget.value })}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Secondname</EditorRowName>
          <EditorRowValue value={user?.lastname} onChange={(event) => setUser({ ...user, lastname: event.currentTarget.value })}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Email</EditorRowName>
          <EditorRowValue value={user?.email} onChange={(event) => setUser({ ...user, email: event.currentTarget.value })}/>
        </EditorRow>
        <EditorRow>
          <EditorRowName>Phone</EditorRowName>
          <EditorRowValue value={user?.phone} onChange={(event) => setUser({ ...user, phone: event.currentTarget.value })}/>
        </EditorRow>
        <EditorRow>
            <SignupLink to={state.isAdmin ? '/admin/login' : '/login'}>Registered? Login</SignupLink>
        </EditorRow>
      </>
    )
  }

  return (
    <StyledAuthorizationContainer>
      <Modal show={true} type={"accept"} name={props.mode} onOK={sendUserData}>
        <EditorContainer>
          {renderModal()}
        </EditorContainer>
      </Modal>
    </StyledAuthorizationContainer>
  )
}

export default Authorization