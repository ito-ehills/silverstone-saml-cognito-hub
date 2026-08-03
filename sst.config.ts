export default $config({
  app(input) {
    return {
      name: "silverstone-saml-cognito-hub",
      removal: input.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const aws = await import("@pulumi/aws");
    console.log('sst.config run()...');

    const myRealtime = new sst.aws.Realtime("SSRealtime", {
      authorizer: "packages/functions/src/authorizer.handler",
    });

    const filter = "#"; //"default/topic";

    myRealtime.subscribe(
      "packages/functions/src/subscribeMqtt.handler",
      { filter: filter }
    );
 
    const auth = await import("./infra/auth.ts");
    //const web = await import("./infra/web");
    const { createWeb } = await import("./infra/web");
    const web = createWeb($app.stage);

    // 6. Outputs to pass directly to your frontend app
    return {
      SiteURL: web.url,
      UserPoolId: auth.userPool.id,
      UserPoolClientId: auth.userPoolClient.id,
      UserPoolDomain: auth.userPoolDomain.domain.apply(
        (domain) => `${domain}.auth.${aws.config.region}.amazoncognito.com`
      ),
    };
  },
});

