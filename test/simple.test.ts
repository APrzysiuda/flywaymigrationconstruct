import { countResources, expect as expectCDK } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';

test('Dumb test', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  expectCDK(stack).to(countResources('AWS::Lambda::Function', 0));
});