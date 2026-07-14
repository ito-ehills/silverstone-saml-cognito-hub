import { Resource } from "sst";
import { Util } from "@silverstone-saml-cognito-hub/core/util";

export const main = Util.handler(async (event) => {

  const msg = {
    stat: "OK",
    msg: "Hello World!",
  }
  // Return the retrieved item
  return JSON.stringify(msg);
});
