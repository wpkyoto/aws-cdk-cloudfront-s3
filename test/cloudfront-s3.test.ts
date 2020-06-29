import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CloudfrontS3 from '../lib/index';
import { Bucket } from '@aws-cdk/aws-s3';

describe('Resource creation', () => {
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
    it('should match snapshot', () => {
      expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
    })
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
    it('should match snapshot', () => {
      expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
    })
  });
  describe('with custom domain', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');
    new CloudfrontS3.CloudfrontS3(stack, 'MyTestConstruct', {
      name: 'example',
      domains: ['example.com'], acmCertificationARN: 'dummyarn',
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
    it('should match snapshot', () => {
      expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
    })
  })
});