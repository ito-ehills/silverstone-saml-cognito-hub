export const handler = async (event: any) => {
  // SSTのRealtimeコンポーネントから渡されるイベントデータを取得
  console.log(`Recieived MQTT Message: ${JSON.stringify(event)}`);
};
