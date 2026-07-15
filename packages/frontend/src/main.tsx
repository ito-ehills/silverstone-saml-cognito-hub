import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import App from './App.tsx'
import config from "./config.ts";
import './index.css'


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      region: config.cognito.REGION,
      //mandatorySignIn: true,
      //identityPoolId: config.cognito.IDENTITY_POOL_ID,
      loginWith: {
        oauth: {
          domain: 'silverstone-saml-hub.auth.us-west-2.amazoncognito.com', // Do not include https://
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:5173', 'https://cloudfront.net'],
          redirectSignOut: ['http://localhost:5173', 'https://cloudfront.net'],
          responseType: 'code', // Must match Authorization code grant in console
        }
      }
    }
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
