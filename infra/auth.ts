import { api } from "./api";
import { CognitoUserPool } from "sst/aws/cognito";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

    // 1. Create the Cognito User Pool
export const userPool = new aws.cognito.UserPool("UserPool", {
      name: `${$app.name}-${$app.stage}-user-pool`,
      passwordPolicy: {
        minimumLength: 8,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        requireUppercase: true,
      },
      // Schema definition to map incoming SAML email
      schemas: [
        {
          attributeDataType: "String",
          developerOnlyAttribute: false,
          mutable: true,
          name: "email",
          required: true,
          stringAttributeConstraints: {
            maxLength: "2048",
            minLength: "0",
          },
        },
      ],
});

    // 2. Create a Cognito Domain (Required for Hosted UI / SAML Redirects)
    // Replace 'my-unique-company-auth' with your own globally unique prefix
export const userPoolDomain = new aws.cognito.UserPoolDomain("UserPoolDomain", {
      domain: `silverstone-saml-auth-${$app.stage}`,
      userPoolId: userPool.id,
});

    // 3. Define the SAML Identity Provider (IdP)
export const samlProvider = new aws.cognito.IdentityProvider("SamlProvider", {
      userPoolId: userPool.id,
      providerName: "CorporateIdP", // Name displayed in your config/IdP
      providerType: "SAML",
      providerDetails: {
        // Option A: Paste the Raw XML Metadata string directly
        // MetadataDoc: '<EntityDescriptor ...></EntityDescriptor>'
        
        // Option B: Provide a publicly accessible URL to your IdP's metadata
        MetadataURL: "https://platinumstone-idp.ayagu.jp:8443/realms/cognito-saml-test/protocol/saml/descriptor",
        
        IDPSignout: "true",
      },
      // Map the SAML assertion attribute to Cognito's email attribute
      attributeMapping: {
        email: "http://xmlsoap.org",
      },
});

    // 4. Determine Local vs Production URL redirects
    const isProd = $app.stage === "production";
    const appUrl = isProd ? "https://amplifyapp.com" : "http://localhost:3000";

    // 5. Create the Cognito App Client configured for SAML
export const userPoolClient = new aws.cognito.UserPoolClient("UserPoolClient", {
      name: `${$app.name}-${$app.stage}-client`,
      userPoolId: userPool.id,
      generateSecret: false,
      allowedOauthFlowsUserPoolClient: true,
      allowedOauthFlows: ["code"], // Authorization code grant
      allowedOauthScopes: ["openid", "email", "profile"],
      callbackUrls: [`${appUrl}/`],
      logoutUrls: [`${appUrl}/`],
      supportedIdentityProviders: [samlProvider.providerName],
});

//export const userPool = sst.aws.CognitoUserPool.get("ss-saml-auth-hub", "us-west-2_evQlGUFUH");

//export const userPoolClient = aws.cognito.UserPoolClient.get("ss-saml-auth-hub-client","us-west-2_evQlGUFUH/3s1dj0in3ucntui7f2jp8febuo");


