import { Resource } from "sst";
import { Util } from "@silverstone-saml-cognito-hub/core/util";
import { IoTDataPlaneClient, PublishCommand } from "@aws-sdk/client-iot-data-plane";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

// Initialize client outside the handler to reuse connection across warm executions
const iotClient = new IoTDataPlaneClient({
  endpoint: "https://aw8q6oon1203x-ats.iot.us-west-2.amazonaws.com",
  region: "us-west-2"
});


export const main = Util.handler(async (event) => {

  let data = {
    content: "",
    attachment: "",
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  }
  console.log("data: ", data);
  const topic = data.topic || "default/topic";
  console.log("topic: ", topic);
  const message = data.message || { status: "success" };
  console.log("message: ", message);

  // Format the payload exactly as a buffer or Uint8Array
  const payload = Buffer.from(JSON.stringify(message));

  console.log("topic: ", topic);
  // Construct the MQTT publish command
  const command = new PublishCommand({
    topic: topic,
    payload: payload,
    qos: 1, // Quality of Service: 0 or 1
  });
  console.log("command created");
  // Fire payload into AWS IoT Core
  await iotClient.send(command);
  console.log("sent...");
  console.log("message2: ", message);
  // Return the retrieved item
  return JSON.stringify(message);
});
