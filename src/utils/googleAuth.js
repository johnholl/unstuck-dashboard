import React, {useContext} from 'react';
import GoogleLogin from 'react-google-login';
import {UserContext} from "../providers/UserProvider";
import { firestore } from "../firebase"

export default function GoogleAuth() {

const responseGoogle = (response) => {
  console.log(response);
  // send the authorization token to firebase
  console.log("is it happening?");
  firestore.collection("users").doc(user.uid).set({authcode: response.code}, {merge: true})
}

    const user = useContext(UserContext);

    return(
        <div>
    <GoogleLogin
        clientId="897270128120-eu772csnvrlg7etvogqnvj0j2ce7apn6.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        disabled={false}
        responseType='code'
        scope='https://www.googleapis.com/auth/calendar'
        accessType='offline'
        prompt='consent'
    />
    </div>
    );
}