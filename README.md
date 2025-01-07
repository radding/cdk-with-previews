# cdk-with-previews

This is an example project that shows how to setup previews for a CDK project. **I have not tested this infra, so do not run `npx cdk deploy`!!**

## How this works

This creates two standard stacks, `staging` and `prod`. This also gives the ability to set up a stack for previews if you pass in either `BRANCH_NAME` or `TARGET_AWS_ACCOUNT`.

### Why do I need `TARGET_AWS_ACCOUNT`

This gives you the ability to deploy the same infrastructure to any account. If you pass this environment variable, it will ignore the variable in the configuration, and use this account id. This is useful for local dev!

### Why do I need `BRANCH_NAME`?

This creates a new stack that is specific for this branch to prevent concurrent PRs to over write eachother. This should stay the same through out PRs.

## How it works

When you open a PR, the action will call CDK deploy like so: `BRANCH_NAME=<github-branch-name> npx cdk deploy <github-branch-name>-preview-InfraWithPreviewsStack`.

When you close a PR, the action will call `BRANCH_NAME=<github-branch-name> npx cdk destroy <github-branch-name>-preview-InfraWithPreviewsStack`.

## Examples

1. PR with previews "deployed:" https://github.com/radding/cdk-with-previews/pull/3
2. PR that was closed: https://github.com/radding/cdk-with-previews/pull/2
3. Clean up action: https://github.com/radding/cdk-with-previews/actions/runs/12655882898
4. Main deploy action: https://github.com/radding/cdk-with-previews/actions/runs/12655882856
