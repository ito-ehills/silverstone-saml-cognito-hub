import { realtime } from "sst/aws/realtime";

export const handler = realtime.authorizer(async (token) => {
  // トークンの検証。成功したらアクセス可能なトピックの権限を返す
  return {
    publish: ["*"],
    subscribe: ["*"],
  };
});
