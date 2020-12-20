import React, { useContext, useState } from 'react';
import {Typography} from 'antd';
import GoogleLogin from 'react-google-login';
import { UserContext } from '../providers/UserProvider';
import { firestore } from '../firebase';

const {Text} = Typography;

export default function GoogleAuth() {

const [authed, setAuthed] = useState(false);

const { user } = useContext(UserContext);

React.useEffect(() => {
  (async function () {
    console.log(user.uid);
    const userDoc = await firestore.collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      setAuthed(userDoc.data().authed);
    }
    else {
      setAuthed(false);
    }
  })();
}, []);

  const responseGoogle = (response) => {
    // send the authorization token to firebase
    firestore
      .collection('users')
      .doc(user.uid)
      .set({ authcode: response.code }, { merge: true });
  };

  return (
    <>
      <GoogleLogin
        clientId="897270128120-eu772csnvrlg7etvogqnvj0j2ce7apn6.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        disabled={authed}
        responseType="code"
        scope="https://www.googleapis.com/auth/calendar"
        accessType="offline"
        prompt="consent"
      />
      {authed && <Text style={{color:"green"}}>{" Calendar is connected"}</Text>}
      </>
  );
}
