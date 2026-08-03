import { bucket } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
      },
      permissions: {
      }
    }
  },
  cors: true
});

api.route("GET /dummy", "packages/functions/src/dummy.main");
api.route("POST /publish", {
  handler: "packages/functions/src/publishMqtt.main",
  permissions: [{
    actions: ["iot:Publish"],
    resources: ["*"]
  }]
});
/*
export const myRealtime = new sst.aws.Realtime("SSRealtime");

myRealtime.subscribe({
  handler: "packages/functions/src/subscribeMqtt.handler"
});
*/
/*
api.route("GET /", {
  link: [bucket],
  handler: "packages/functions/src/api.handler",
});
*/

