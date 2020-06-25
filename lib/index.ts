import * as cdk from '@aws-cdk/core';
import { OriginAccessIdentity, CloudFrontWebDistribution, LambdaEdgeEventType } from '@aws-cdk/aws-cloudfront';
import { Bucket } from '@aws-cdk/aws-s3';
import { Runtime, Version } from '@aws-cdk/aws-lambda';
import { RemovalPolicy, CfnOutput, Construct, Tag } from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import {createHash} from 'crypto'
import { readFileSync } from 'fs';


export interface CloudfrontS3Props {
  /**
   * Resource name
   */
  name: string;

  /**
   * Certification ARN for CloudFront distribution
   */
  acmCertificationARN?: string;

  /**
   * CloudFront domain names
   * If acmCertificationARN is empty, the parameter does not useed
   */
  domains?: string[]

  /**
   * Import own S3 bucket
   */
  s3Bucket?: Bucket

  /**
   * Log Lambda@edge process
   */
  debugMode?: boolean;
}

export class CloudfrontS3 extends cdk.Construct {
  /**
   * Lambda@edge function
   */
  public readonly OriginRequestHandler: NodejsFunction

  /**
   * Lambda@edge function version
   */
  public readonly OriginRequestHandlerVersion: Version

  /**
   * S3 bucket
   */
  public readonly WebsiteBucket: Bucket

  /**
   * Origin Access Identity
   */
  public readonly DistributionOAI: OriginAccessIdentity

  /**
   * CloudFront distribution
   */
  public readonly Distribution: CloudFrontWebDistribution

  constructor(scope: cdk.Construct, id: string, props: CloudfrontS3Props) {
    super(scope, id);
    const {
      name,
      acmCertificationARN,
      domains,
      s3Bucket,
      debugMode,
    } = props;
    const EDGE_URL_HANDLER_PATH = './lib/lambda/originRequest.ts'
    const resources: Construct[] = []
  
    /**
     * Lambda Edge Functions
     */
    this.OriginRequestHandler = new NodejsFunction(this, 'OriginRequestHandler', {
      handler: 'handler',
      runtime: Runtime.NODEJS_12_X,
      functionName: `${name}URLFormatter`,
      entry: EDGE_URL_HANDLER_PATH,
      environment: {
        DEBUG: debugMode ? 'true': 'false'
      }
    })
    resources.push(this.OriginRequestHandler)
  
    /**
     * ZIPファイルが変更されたら新しいバージョンを発行する
     */
    this.OriginRequestHandlerVersion = this.OriginRequestHandler.addVersion(
      createHash('sha256').update(
        readFileSync(
          EDGE_URL_HANDLER_PATH,
          'utf-8'
        )
      ).digest('hex')
    )

    /**
     * S3 bucket
     */
    this.WebsiteBucket = s3Bucket || new Bucket(this, 'WebsiteBucket',{
      removalPolicy: RemovalPolicy.DESTROY
    })
    resources.push(this.WebsiteBucket)

    /**
     * CloudFront Distribution
     */

    this.DistributionOAI = new OriginAccessIdentity(this, 'OAIForBucket')
    this.WebsiteBucket.grantRead(this.DistributionOAI)
    this.Distribution = new CloudFrontWebDistribution(this, 'CDN', {
      aliasConfiguration: acmCertificationARN && domains ? {
          acmCertRef: acmCertificationARN,
          names: domains,
        }: undefined,
      defaultRootObject: 'index.html',
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: this.WebsiteBucket,
          originAccessIdentity: this.DistributionOAI
        },
        behaviors: [{
          isDefaultBehavior: true,
          compress: true,
          lambdaFunctionAssociations: [{
            lambdaFunction: this.OriginRequestHandlerVersion,
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
          }]
        }]
      }]
    })
    this.Distribution.node.addDependency(this.OriginRequestHandler)
    resources.push(this.Distribution)
  

    new CfnOutput(this, 'CloudFrontDomain', {
      value:`https://${this.Distribution.domainName}`
    })

  }
}
