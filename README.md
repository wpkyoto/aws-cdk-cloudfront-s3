# ⚠️ DEPRECATED: CloudFront S3 with Origin Access Identity

## 🚨 This library is deprecated and no longer maintained

This library is based on AWS CDK v1 (v1.47.0) and uses **Origin Access Identity (OAI)**, which is now legacy technology. AWS recommends using **Origin Access Control (OAC)** instead.

### Why this library is deprecated:

- ❌ **AWS CDK v1 is in maintenance mode** (only critical bug fixes)
- ❌ **Origin Access Identity (OAI) is legacy** - will not work in new S3 regions
- ❌ **Using deprecated CloudFront APIs** (`CloudFrontWebDistribution`)
- ❌ **Node.js 12 runtime is end-of-life**
- ❌ **Security vulnerabilities** due to outdated dependencies

## ✅ Recommended Migration: AWS Solutions Constructs

AWS provides an official, well-architected construct that offers superior functionality and security:

### Install AWS Solutions Constructs

```bash
npm install @aws-solutions-constructs/aws-cloudfront-s3
```

### Basic Usage

```typescript
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

new CloudFrontToS3(stack, 'CloudFrontToS3', {
  // Automatically provides:
  // - Origin Access Control (OAC) - latest security standard
  // - CloudFront access logging
  // - S3 encryption, versioning, and access logging
  // - Block all public access
  // - Well-Architected best practices
});
```

### What you get automatically:

✅ **Origin Access Control (OAC)** - Modern, secure alternative to OAI
✅ **Works in all S3 regions** - Including new regions
✅ **SSE-KMS encryption support**
✅ **Short-term credentials** - Enhanced security
✅ **CloudFront and S3 access logging** - Built-in compliance
✅ **Encryption and versioning** - Data protection by default
✅ **Public access blocked** - Secure by default

### Migration Guide

#### Before (this deprecated library):

```typescript
import { CloudfrontS3 } from '@wpkyoto/aws-cdk-cloudfront-s3';

new CloudfrontS3(stack, 'MyConstruct', {
  name: 'example',
  acmCertificationARN: 'arn:aws:acm:...',
  domains: ['example.com']
});
```

#### After (AWS Solutions Constructs):

```typescript
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

new CloudFrontToS3(stack, 'CloudFrontToS3', {
  cloudFrontDistributionProps: {
    certificate: Certificate.fromCertificateArn(
      stack,
      'Certificate',
      'arn:aws:acm:...'
    ),
    domainNames: ['example.com'],
  }
});
```

#### Using existing S3 bucket:

```typescript
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const existingBucket = Bucket.fromBucketName(stack, 'Bucket', 'my-bucket');

new CloudFrontToS3(stack, 'CloudFrontToS3', {
  existingBucketObj: existingBucket,
});
```

### Alternative: Native CDK v2 Constructs

For more control, use native CDK v2 constructs:

```typescript
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';

const bucket = new Bucket(stack, 'WebsiteBucket');

const distribution = new Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: S3BucketOrigin.withOriginAccessControl(bucket),
  },
  defaultRootObject: 'index.html',
});
```

### Replacing Lambda@Edge URL rewriting

Instead of Lambda@Edge for URL rewriting (`/` → `/index.html`), use **CloudFront Functions**:

- **6x cheaper** than Lambda@Edge
- **Faster execution** (runs at edge locations)
- **Better for lightweight operations** like URL rewriting

```typescript
import { Function, FunctionCode, FunctionEventType } from 'aws-cdk-lib/aws-cloudfront';

const urlRewriteFunction = new Function(stack, 'UrlRewrite', {
  code: FunctionCode.fromInline(`
    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      } else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }
      return request;
    }
  `),
});

new Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: S3BucketOrigin.withOriginAccessControl(bucket),
    functionAssociations: [{
      function: urlRewriteFunction,
      eventType: FunctionEventType.VIEWER_REQUEST,
    }],
  },
});
```

## Resources

- [AWS Solutions Constructs - CloudFrontToS3](https://docs.aws.amazon.com/solutions/latest/constructs/aws-cloudfront-s3.html)
- [AWS CDK v2 CloudFront Documentation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront-readme.html)
- [AWS Blog: New CDK L2 construct for CloudFront OAC](https://aws.amazon.com/blogs/devops/a-new-aws-cdk-l2-construct-for-amazon-cloudfront-origin-access-control-oac/)

---

## Old Documentation (for reference only)

<details>
<summary>Click to expand deprecated usage documentation</summary>

### AWS CDK version

Now using `v1.47.0`.

### Install

```
$ npm install -S @wpkyoto/aws-cdk-cloudfront-s3
```

### Usage


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

</details>