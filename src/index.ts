import * as ec2 from '@aws-cdk/aws-ec2';
import * as awsLambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as awssecret from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';

//version : 0.1.0
export class FlywayConstruct extends cdk.Construct {

  flywayLambdaMigration: awsLambda.Function;
  handler = 'be.tech.necko.flywayjar.Main::handleRequest';
  idLambdaCode = 'bucketMigration';
  bucketCodeArn = 'arn:aws:s3:::flywaymigrationconstruct';
  objectCodeKey = 'flywayjar.0.1.0.zip';
  defaultMemorySize = 512;
  defaultTimeout = 30;

  constructor(scope: cdk.Construct,
    id: string,
    param:{
      vpc: ec2.IVpc;
      subnet: ec2.SubnetSelection;
      securityGroups: [ec2.SecurityGroup];
      bucket: s3.IBucket;
      migrationBucketSecretArn: string;
      timeout?: number;
      memorySize?: number;
    },
  ) {
    super(scope, id);
    const secretManager= awssecret.Secret.fromSecretCompleteArn(this, 'managerDB', param.migrationBucketSecretArn);
    this.flywayLambdaMigration = new awsLambda.Function(this, id, {
      vpc: param.vpc,
      vpcSubnets: param.subnet,
      securityGroups: param.securityGroups,
      memorySize: param.memorySize || this.defaultMemorySize,
      timeout: cdk.Duration.seconds(param.timeout) || cdk.Duration.seconds(this.defaultTimeout),
      handler: this.handler,
      runtime: awsLambda.Runtime.JAVA_11,
      environment: {
        ARN: param.migrationBucketSecretArn,
        BUCKETNAME: param.bucket.bucketName,
      },
      code: awsLambda.S3Code.fromBucket(
        s3.Bucket.fromBucketArn(this, this.idLambdaCode, this.bucketCodeArn),
        this.objectCodeKey),
    });
    secretManager.grantRead(this.flywayLambdaMigration);
  }
}