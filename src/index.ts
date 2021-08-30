import * as ec2 from '@aws-cdk/aws-ec2';
import * as awsLambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as awssecret from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';

//version : 0.1.0


export interface FlywayConstructParams {
  readonly migrationDBSecretManager: awssecret.ISecret;
  readonly bucketMigrationSQL: s3.IBucket;
  readonly vpc?: ec2.IVpc;
  readonly subnet?: ec2.SubnetSelection;
  readonly securityGroups?: ec2.ISecurityGroup[];
  readonly memorySize?: number;
  readonly timeout?: cdk.Duration;
}
export class FlywayConstruct extends cdk.Construct {

  static readonly HANDLER = 'tech.necko.flywayjar.Main::handleRequest';
  static readonly ID_LAMBDA_CODE = 'bucketMigration';
  static readonly BUCKET_CODE_ARN = 'arn:aws:s3:::flywaymigrationconstruct';
  static readonly OBJECT_CODE_KEY = 'flywayjar.0.2.0.zip';

  flywayLambdaMigration: awsLambda.Function;

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
      handler: FlywayConstruct.HANDLER,
      runtime: awsLambda.Runtime.JAVA_11,
      environment: {
        ARN: params.migrationDBSecretManager.secretArn,
        BUCKET_NAME: params.bucketMigrationSQL.bucketName,
      },
      code: awsLambda.S3Code.fromBucket(
        s3.Bucket.fromBucketArn(this, FlywayConstruct.ID_LAMBDA_CODE, FlywayConstruct.BUCKET_CODE_ARN), FlywayConstruct.OBJECT_CODE_KEY),
    });
    params.migrationDBSecretManager.grantRead(this.flywayLambdaMigration);
    params.bucketMigrationSQL.grantRead(this.flywayLambdaMigration);
  }
}