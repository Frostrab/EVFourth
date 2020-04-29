import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Layout from './layout';
import {useAuth} from '../context/auth';
const PrivateRoute = ({component: Component, ...rest}) => {
  const {authTokens} = useAuth ();
  return (
    <Route
      {...rest}
      render={props =>
        authTokens
        // localStorage.getItem ('token')
          ? <Layout>
              <Component {...props} />
            </Layout>
          : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  );
};
export default PrivateRoute;
