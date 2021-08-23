import * as ec2 from '@aws-cdk/aws-ec2';
import * as awsLambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class FlywayConstruct extends cdk.Construct {
  flywayLambdaMigration: awsLambda.Function;

  constructor(scope: cdk.Construct,
    id: string,
    VPC: ec2.Vpc,
    subnet: ec2.SubnetSelection,
    securityGroup: ec2.SecurityGroup,
    bucketName: string,
    url: string,
    user: string,
    password: string) {
    super(scope, id);
    this.flywayLambdaMigration = new awsLambda.Function(this, 'flywayLambdaMigration', {
      vpc: VPC,
      vpcSubnets: subnet,
      securityGroups: [securityGroup],
      allowPublicSubnet: true,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      handler: 'flywayjar.Main::handleRequest',
      runtime: awsLambda.Runtime.JAVA_11,
      environment: {
        url: url,
        bucketName: bucketName,
        user: user,
        password: password,
      },
      code: awsLambda.Code.fromAsset('flywayjar.zip'),
    });
  }
}