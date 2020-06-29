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

### Own Lambda@edge function

```typescript
import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { CloudfrontS3 } from '@wpkyoto/aws-cdk-cloudfront-s3';
import { Runtime } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import {createHash} from 'crypto'
import { readFileSync } from 'fs';
import { join } from 'path';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'TestStack');
new CloudfrontS3(stack, 'MyTestConstruct', {
  name: 'example',
  edgeFunctions: {
    "origin-response": new NodejsFunction(this, 'OriginRequestHandler', {
        handler: 'handler',
        runtime: Runtime.NODEJS_12_X,
        functionName: `ExampleEdgeFunction`,
        entry: join(__dirname, '/lambda/originResponse.ts'),
      }).addVersion(
        createHash('sha256').update(
          readFileSync(
            join(__dirname, '/lambda/originResponse.ts'),
            'utf-8'
          )
        ).digest('hex')
      )
  }
});

```