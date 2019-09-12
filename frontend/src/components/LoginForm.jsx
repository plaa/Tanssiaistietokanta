import React, {useContext} from 'react';
import {Button} from "@blueprintjs/core";
import {UserContext} from '../services/users';

function LoginForm() {
  const {user, login, logout} = useContext(UserContext);
  return <>
    {user
      ? <Button onClick={logout}>Logout</Button>
      : <Button onClick={login}>Login</Button>}
  </>
}

export default LoginForm;

