import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CloudfrontS3 from '../lib/index';

test('SQS Queue Created', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");
    // WHEN
    new CloudfrontS3.CloudfrontS3(stack, 'MyTestConstruct', {
      name: 'example'
    });
    // THEN
    expectCDK(stack).to(haveResource("AWS::SQS::Queue"));
});
