import boto3
import time
import json

kinesis = boto3.client("kinesis", region_name='eu-west-1')

shard_id = "shardId-000000000000"

pre_shard_it = kinesis.get_shard_iterator(StreamName="kinesis-demo", ShardId=shard_id, ShardIteratorType="LATEST")
shard_it = pre_shard_it["ShardIterator"]
while 1==1:
     out = kinesis.get_records(ShardIterator=shard_it, Limit=1)
     shard_it = out["NextShardIterator"]
     print out;
     print ""
     time.sleep(1)