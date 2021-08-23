import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class FlywayConstruct extends cdk.Construct {
  flywayLambdaMigration: lambda.Function;

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

    this.flywayLambdaMigration = new lambda.Function(this, 'flywayLambdaMigration', {
      vpc: VPC,
      vpcSubnets: subnet,
      securityGroups: [securityGroup],
      allowPublicSubnet: true,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      handler: 'flywayjar.Main::handleRequest',
      runtime: lambda.Runtime.JAVA_11,
      environment: {
        url: url,
        bucketName: bucketName,
        user: user,
        password: password,
      },
      code: lambda.Code.fromBucket(
        s3.Bucket.fromBucketArn(this, 'zipBucket', 'arn:aws:s3:::flywaymigrationconstruct'),
        'flywayjar.zip'),
    });

  }
}