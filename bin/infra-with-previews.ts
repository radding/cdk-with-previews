#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraWithPreviewsStack } from '../lib/infra-with-previews-stack';

const envs: Record<"prod" | "staging" | "preview", {
  env: NonNullable<cdk.StackProps["env"]>
}> = {
  "preview": {
    env: {
      account: "123456789",
      region: "us-east-1"
    }
  },
  "staging": {
    env: {
      account: "123456789",
      region: "us-east-1"
    }
  },
  "prod": {
    env: {
      account: "123456789",
      region: "us-east-1"
    }
  }
} as const

const app = new cdk.App();

Object.entries(envs).forEach(([envName, envSettings]) => {
  if (envName === "preview") {
    return;
  }
  new InfraWithPreviewsStack(app, `${envName}-InfraWithPreviewsStack`, {
    /* If you don't specify 'env', this stack will be environment-agnostic.
    * Account/Region-dependent features and context lookups will not work,
    * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
    * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    /* Uncomment the next line if you know exactly what Account and Region you
    * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  });
})

if (process.env.BRANCH_NAME || process.env.TARGET_AWS_ACCOUNT) {
  let name = `preview`;
  if (process.env.BRANCH_NAME) {
    name = `${process.env.BRANCH_NAME}-${name}`;
  }

  new InfraWithPreviewsStack(app, `${name}-InfraWithPreviews`, {
    ...envs.preview,
    env: {
      ...envs.preview,
      account: process.env.TARGET_AWS_ACCOUNT ?? envs.preview.env.account,
      region: process.env.REGION ?? envs.preview.env.region,
    }
  })
}