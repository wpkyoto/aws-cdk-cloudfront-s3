import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import {
  CloudfrontS3, CloudfrontS3Props
} from '../../lib'

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, options: CloudfrontS3Props & {
    s3BucketName?: string;
    s3BucketArn?: string;
  }, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const params: CloudfrontS3Props = {...options}
    if (options.s3BucketArn) {
      params.s3Bucket = Bucket.fromBucketArn(this, 'ImportBucket', options.s3BucketArn)
    } else if (options.s3BucketName) {
      params.s3Bucket = Bucket.fromBucketName(this, 'ImportBucket', options.s3BucketName)
    }
    const resources = new CloudfrontS3(this, 'CloudFrontWithS3', params)
    const DefaultContent = new BucketDeployment(this, 'DefaultContentUpload', {
      destinationBucket: params.s3Bucket || resources.WebsiteBucket,
      sources: [Source.asset('./public')],
      retainOnDelete: false,
    })

  }
}
