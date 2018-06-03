# Kinesis Demo


You can install the AWS components, by simply running the following command:

```
aws cloudformation create-stack --template-body file://kinesis-demo.yaml --stack-name kinesis-demo --parameters ParameterKey=BucketName,ParameterValue=<unique_bucket_name> --capabilities CAPABILITY_NAMED_IAM
```
