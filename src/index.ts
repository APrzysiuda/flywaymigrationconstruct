import * as ec2 from '@aws-cdk/aws-ec2';
import * as awsLambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as awssecret from '@aws-cdk/aws-secretsmanager';

export interface constructProp {
  VPC: ec2.Vpc;
  subnet: ec2.SubnetSelection;
  securityGroup: ec2.SecurityGroup;
  bucketName: string;
  arn: string;
}
export class FlywayConstruct extends cdk.Construct {
  flywayLambdaMigration: awsLambda.Function;

  constructor(scope: cdk.Construct, id: string, constructProp: constructProp) {
    super(scope, id);
    const secretManager= awssecret.Secret.fromSecretCompleteArn(this, 'managerDB', constructProp.arn);
    this.flywayLambdaMigration = new awsLambda.Function(this, 'flywayLambdaMigration', {
      vpc: constructProp.VPC,
      vpcSubnets: constructProp.subnet,
      securityGroups: [constructProp.securityGroup],
      allowPublicSubnet: true,
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      handler: 'flywayjar.Main::handleRequest',
      runtime: awsLambda.Runtime.JAVA_11,
      environment: {
        ARN: constructProp.arn,
        BUCKETNAME: constructProp.bucketName,
      },
      code: awsLambda.S3Code.fromBucket(s3.Bucket.fromBucketArn(this, 'test', 'arn:aws:s3:::flywaymigrationconstruct'), 'flywayjar.zip'),
    });
    secretManager.grantRead(this.flywayLambdaMigration);
  }
}