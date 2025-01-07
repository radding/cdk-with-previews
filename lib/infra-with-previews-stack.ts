import * as cdk from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { Code, Function, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { FunctionUrlOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraWithPreviewsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3 = new Bucket(this, "static");
    new BucketDeployment(this, "deployment", {
      sources: [Source.asset("./static/")],
      destinationBucket: s3,
    });

    const distro = new CloudFrontToS3(this, "distro", {
      existingBucketObj: s3,
    });

    const apiLambda = new Function(this, "api", {
      handler: "index.handler",
      code: Code.fromAsset("./api"),
      runtime: Runtime.NODEJS_LATEST,
    })

    const fnURL = apiLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.AWS_IAM,
    })

    distro.cloudFrontWebDistribution.addBehavior("api/**", FunctionUrlOrigin.withOriginAccessControl(fnURL))
    distro.cloudFrontWebDistribution.addBehavior("api2/**", FunctionUrlOrigin.withOriginAccessControl(fnURL))

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraWithPreviewsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
