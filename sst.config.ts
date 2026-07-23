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

    const auth = await import("./infra/auth.ts");
    const web = await import("./infra/web");

    // 6. Outputs to pass directly to your frontend app
    return {
      SiteURL: web.frontend.url,
      UserPoolId: auth.userPool.id,
      UserPoolClientId: auth.userPoolClient.id,
      UserPoolDomain: auth.userPoolDomain.domain.apply(
        (domain) => `${domain}.auth.${aws.config.region}.amazoncognito.com`
      ),
    };
  },
});

