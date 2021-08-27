import * as ec2 from '@aws-cdk/aws-ec2';
import * as awsLambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as awssecret from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';

//version : 0.1.0

export interface FlywayConstructParams{
  bucket: s3.IBucket;
  vpc: ec2.IVpc;
  subnet: ec2.SubnetSelection;
  securityGroups: [ec2.SecurityGroup];
  migrationBucketSecretArn: string;
  timeout?: number;
  memorySize?: number;
}
export class FlywayConstruct extends cdk.Construct {

  flywayLambdaMigration: awsLambda.Function;
  handler = 'be.tech.necko.flywayjar.Main::handleRequest';
  idLambdaCode = 'bucketMigration';
  bucketCodeArn = 'arn:aws:s3:::flywaymigrationconstruct';
  objectCodeKey = 'flywayjar.0.1.0.zip';

  constructor(scope: cdk.Construct,
    id: string,
    params: FlywayConstructParams,
  ) {
    super(scope, id);
    const secretManager= awssecret.Secret.fromSecretCompleteArn(this, 'managerDB', params.migrationBucketSecretArn);
    this.flywayLambdaMigration = new awsLambda.Function(this, id, {
      vpc: params.vpc,
      vpcSubnets: params.subnet,
      securityGroups: params.securityGroups,
      memorySize: params.memorySize || 512,
      timeout: cdk.Duration.seconds(params.timeout) || cdk.Duration.seconds(30),
      handler: this.handler,
      runtime: awsLambda.Runtime.JAVA_11,
      environment: {
        ARN: params.migrationBucketSecretArn,
        BUCKETNAME: params.bucket.bucketName,
      },
      code: awsLambda.S3Code.fromBucket(
        s3.Bucket.fromBucketArn(this, this.idLambdaCode, this.bucketCodeArn),
        this.objectCodeKey),
    });
    secretManager.grantRead(this.flywayLambdaMigration);
  }
}