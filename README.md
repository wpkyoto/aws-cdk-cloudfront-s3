# CloudFront S3 with Origin Access Identity


## AWS CDK version

Now using `v1.47.0`.

## Install

```
$ npm install -S @wpkyoto/aws-cdk-cloudfront-s3
```

## Usage


```typescript
import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { CloudfrontS3 } from '@wpkyoto/aws-cdk-cloudfront-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');
new CloudfrontS3(stack, 'MyTestConstruct', {
  name: 'example',
});

```

### Use own S3 bucket

```typescript

import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { CloudfrontS3 } from '@wpkyoto/aws-cdk-cloudfront-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');
new CloudfrontS3(stack, 'MyTestConstruct', {
  name: 'example',
  s3Bucket: Bucket.fromBucketName(stack, 'Dummy', 'dummy'),
});
```

### Custom Domain

```typescript

import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { CloudfrontS3 } from '@wpkyoto/aws-cdk-cloudfront-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');
new CloudfrontS3(stack, 'MyTestConstruct', {
  name: 'example',
  acmCertificationARN: 'YOUR_ACM_ARN',
  domains: ['example.com']
});
```

### Logging Lambda@edge process

```typescript
import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { CloudfrontS3 } from '@wpkyoto/aws-cdk-cloudfront-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');
new CloudfrontS3(stack, 'MyTestConstruct', {
  name: 'example',
  debugMode: true
});

```