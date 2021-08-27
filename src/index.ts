import * as ec2 from '@aws-cdk/aws-ec2';
import * as awsLambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as awssecret from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';

//version : 0.1.0

export interface FlywayConstructParams {
  readonly bucket: s3.IBucket;
  readonly vpc: ec2.IVpc;
  readonly subnet: ec2.SubnetSelection;
  readonly securityGroups: [ec2.ISecurityGroup];
  readonly migrationBucketSecretManager: awssecret.ISecret;
  readonly timeout?: cdk.Duration;
  readonly memorySize?: number;
}
export class FlywayConstruct extends cdk.Construct {

  flywayLambdaMigration: awsLambda.Function;
  HANDLER = 'be.tech.necko.flywayjar.Main::handleRequest';
  ID_LAMBDA_CODE = 'bucketMigration';
  BUCKET_CODE_ARN = 'arn:aws:s3:::flywaymigrationconstruct';
  OBJECT_CODE_KEY = 'flywayjar.0.1.0.zip';

  constructor(scope: cdk.Construct,
    id: string,
    params: FlywayConstructParams,
  ) {
    super(scope, id);
    this.flywayLambdaMigration = new awsLambda.Function(this, id, {
      vpc: params.vpc,
      vpcSubnets: params.subnet,
      securityGroups: params.securityGroups,
      memorySize: params.memorySize || 512,
      timeout: params.timeout || cdk.Duration.seconds(30),
      handler: this.HANDLER,
      runtime: awsLambda.Runtime.JAVA_11,
      environment: {
        ARN: params.migrationBucketSecretManager.secretArn,
        BUCKET_NAME: params.bucket.bucketName,
      },
      code: awsLambda.S3Code.fromBucket(
        s3.Bucket.fromBucketArn(this, this.ID_LAMBDA_CODE, this.BUCKET_CODE_ARN),
        this.OBJECT_CODE_KEY),
    });
    params.migrationBucketSecretManager.grantRead(this.flywayLambdaMigration);
  }
}