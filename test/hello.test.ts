import { expect, haveResource } from '@aws-cdk/assert';
import * as s3 from '@aws-cdk/aws-s3';
import * as secrets from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { FlywayConstruct } from '../src';

test('test stack', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'Test');
  const bucket = new s3.Bucket(stack, 'bucket');
  const secret = new secrets.Secret(stack, 'secret');
  const construct = new FlywayConstruct(stack, 'testConstruct', {
    migrationDBSecretManager: secret,
    bucketMigrationSQL: bucket,
  });
  construct.flywayLambdaMigration;
  expect(stack).to(haveResource('AWS::Lambda::Function'));
});
