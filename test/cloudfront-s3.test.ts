import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CloudfrontS3 from '../lib/index';
import { Bucket } from '@aws-cdk/aws-s3';

describe('Stack test', () => {
  describe('default', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    new CloudfrontS3.CloudfrontS3(stack, 'MyTestConstruct', {
      name: 'example',
    });
    it.each([
      'AWS::IAM::Role',
      'AWS::Lambda::Function',
      'AWS::Lambda::Version',
      'AWS::S3::Bucket',
      'AWS::S3::BucketPolicy',
      'AWS::CloudFront::CloudFrontOriginAccessIdentity',
      'AWS::CloudFront::Distribution',
    ])('Should create a %p resourec', type => {
      expectCDK(stack).to(haveResource(type));
    });
  });
  describe('import s3 bucket', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    new CloudfrontS3.CloudfrontS3(stack, 'MyTestConstruct', {
      name: 'example',
      s3Bucket: Bucket.fromBucketName(stack, 'Dummy', 'dummy'),
    });
    it.each([
      'AWS::IAM::Role',
      'AWS::Lambda::Function',
      'AWS::Lambda::Version',
      'AWS::CloudFront::CloudFrontOriginAccessIdentity',
      'AWS::CloudFront::Distribution',
    ])('Should create a %p resourec', type => {
      expectCDK(stack).to(haveResource(type));
    });
    it.each(['AWS::S3::Bucket', 'AWS::S3::BucketPolicy'])(
      'Should not create a %p resourec',
      type => {
        expectCDK(stack).notTo(haveResource(type));
      }
    );
  });
});
describe('stack snapshot', () => {
  it.each([
    {},
    { s3BucketName: 'dummy' },
    { domains: ['example.com'], acmCertificationARN: 'dummyarn' },
  ])('should match snapthos', conf => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    if (conf.s3BucketName) {
      // @ts-ignore
      conf.s3Bucket = Bucket.fromBucketName(stack, 'Dummy', conf.s3BucketName);
      delete conf.s3BucketName;
    }
    new CloudfrontS3.CloudfrontS3(stack, 'MyTestConstruct', {
      ...(conf as CloudfrontS3.CloudfrontS3Props),
      name: 'example',
    });
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});

describe('Resoruce test', () => {
  const app: cdk.App = new cdk.App();
  const stack: cdk.Stack = new cdk.Stack(app, 'TestStack');
  const resource: CloudfrontS3.CloudfrontS3 = new CloudfrontS3.CloudfrontS3(
    stack,
    'MyTestConstruct',
    {
      name: 'example',
    }
  );
  const resourceNames: Array<keyof CloudfrontS3.CloudfrontS3> = [
    'DistributionOAI',
    'Distribution',
  ];
  it.each(resourceNames)('[Resource: %p] Should match snapshot', name => {
    expect(resource[name]).toMatchSnapshot();
  });
});
