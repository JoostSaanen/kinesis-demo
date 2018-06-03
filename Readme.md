# Kinesis Demo


## AWS Infrastructure
You can install the AWS components, by simply running the following command:

```
aws cloudformation create-stack --template-body file://kinesis-demo.yaml --stack-name kinesis-demo --parameters ParameterKey=BucketName,ParameterValue=<unique_bucket_name> --capabilities CAPABILITY_NAMED_IAM
```

## Middleman project
Middleman is a static site generator using all the shortcuts and tools in modern web development. For deploying the Kinesis-demo website, run:

```
bundle exec middleman build
aws s3 sync build s3://<unique_bucket_name> --acl public-read --cache-control "public, max-age=86400"
```