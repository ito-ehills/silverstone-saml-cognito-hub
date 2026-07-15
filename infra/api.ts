import { bucket } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
      },
    }
  },
  cors: true
});

api.route("GET /dummy", "packages/functions/src/dummy.main");

/*
api.route("GET /", {
  link: [bucket],
  handler: "packages/functions/src/api.handler",
});
*/

