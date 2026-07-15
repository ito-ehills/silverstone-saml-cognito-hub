import { api } from "./api";
import { CognitoUserPool } from "sst/aws/cognito";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

export const userPool = sst.aws.CognitoUserPool.get("ss-saml-auth-hub", "us-west-2_evQlGUFUH");

export const userPoolClient = aws.cognito.UserPoolClient.get("ss-saml-auth-hub-client","us-west-2_evQlGUFUH/3s1dj0in3ucntui7f2jp8febuo");


//
//export const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
//  userPools: [
//    {
//      userPool: userPool.id,
//      client: userPoolClient.id,
//    },
//  ],
//  permissions: {
//    authenticated: [
//      {
//        actions: ["s3:*"],
//        resources: [
//          $concat(bucket.arn, "/private/${cognito-identity.amazonaws.com:sub}/*"),
//        ],
//      },
//      {
//        actions: [
//          "execute-api:*",
//        ],
//        resources: [
//          $concat(
//            "arn:aws:execute-api:",
//            region,
//            ":",
//            aws.getCallerIdentityOutput({}).accountId,
//            ":",
//            api.nodes.api.id,
//            "/*/*/*"
//          ),
//        ],
//      },
//    ],
//  },
//});
