#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ExampleStack } from '../lib/example-stack';

const app = new cdk.App();

new ExampleStack(app, 'DefaultExample', {
    name: "Default",
})
/*
new ExampleStack(app, 'ImportS3Example', {
    name: 'ImportS3Bucket',
    s3BucketName: 'dummy'
})
new ExampleStack(app, 'WithCustomDomain', {
    name: 'WithCustomDomain',
    domains: ['PUT_YOUR_DOMAIN'],
    acmCertificationARN: 'PUT_YOUR_ACM_ARN',
})
*/