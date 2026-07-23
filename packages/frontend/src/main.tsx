import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import App from './App.tsx'
import config from "./config.ts";
import './index.css'

// ⚠️ REQUIRED FOR V6 MANUAL OAUTH / SAML REDIRECTS:
import 'aws-amplify/auth/enable-oauth-listener';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
//      region: config.cognito.REGION,
      //mandatorySignIn: true,
      //identityPoolId: config.cognito.IDENTITY_POOL_ID,
      loginWith: {
        oauth: {
          domain: 'silverstone-saml-auth-kayito.auth.us-west-2.amazoncognito.com', // Do not include https://
          scopes: ['openid', 'email', 'profile'],
//          scopes: ['email'],
          redirectSignIn: ['http://localhost:5173/', 'https://cloudfront.net'],
          redirectSignOut: ['http://localhost:5173/', 'https://cloudfront.net'],
          responseType: 'code', // Must match Authorization code grant in console
        }
      }
    }
  },
  Storage: {
//    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
//    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "Silverstone",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

console.log('before Hub listen registered...');
// Option A: Listen for sign-in completion
Hub.listen('auth', ({ payload }) => {
  console.log('Hub.listen callback handler called ...');
  console.log(payload);
  if (payload.event === 'signedIn') {
    console.log('User successfully signed in!');
    checkUser();
  }
});

// Option B: Ensure session is fetched before getting user
async function checkUser() {
  try {
    // Forces token retrieval/exchange if redirect code is present
    await fetchAuthSession(); 
    const user = await getCurrentUser();
    console.log('Authenticated User:', user);
  } catch (error) {
    console.error('User is not authenticated:', error);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
