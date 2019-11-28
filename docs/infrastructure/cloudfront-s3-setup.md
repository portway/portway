# Assets Storage and CDN

We use Cloudfront as our Content Delivery Network (CDN) and store assets on S3.

## S3 Setup
1. Setup S3. Needs documentation.
1. Generate IAM user with S3 read/write access and generate keys for use by Portway. Needs documentation.

## CloudFront setup

1. Create a Cloudfront Distribution
1. Use distribution type "web"
1. Generate the Origin Domain Name using the S3 URL + region
1. Leave default settings for protocols, allowed methods, etc.
1. Customize "Object Caching"
1. Set the Minimum TTL to 86400 (1 day, in seconds)
1. Turn on "Compress Objects Automatically"
1. Choose the appropriate price class. For production, "Use All Edge Locations"
1. Pick the domain name for the assets. Should be a subdomain of `portwaycontent.com`. Enter this in the "Alternate Domain Names (CNAMEs)" field
1. Choose "Custom SSL Certificate" and then "Request or Import a Certificate with ACM"
  - ACM will walk you through steps to verify the domain
1. Create the distribution
1. The distribution now has a url. In Hover, update the subdomain's CNAME to point to the CloudFront url

## Lambda Function to Disable an Org's CDN

1. In Lambda, create a new function called "return403"
1. Set the runtime as Node.js 12.x (or whatever the latest LTS release is, code below is for 12)
1. Under Permissions, the Execution role can be created with basic Lambda Permissions
1. Using the inline code editor, add the following code:
```
exports.handler = async (event, thing, callback) => {
  const response = {
    status: 403
  }
  callback(null, response)
}
```
1. Under "Execution role" open the link to view the role in the IAM console
  1. Go to the "Trust relationships" tab and "Edit trust relationship"
  1. Add the following entities to the policy:
  ```
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      },
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "edgelambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
  ```
1. The lambda function is now setup to be run as a lambda@edge function on CloudFront to inject itself between the S3 origin and the CloudFront edge cache. Then, if required, the CloudFront CDN can be disabled for an organization. See section below.

## Setup CloudWatch Alarms
We need to track CDN usage and get alerts if usage exceeds certain thresholds. This requires a CloudWatch Alarm + SNS Topic + Email notifications

1. Navigate to CloudWatch
1. Go to "Alarms" and create a new alarm
1. Search for CloudFront, find the distribution, and choose the "BytesDownloaded" metric
1. Edit the metric to set the statistic to "Maximum" and the period to "5 minutes"
1. The "Conditions" is static, and > the number of bytes
1. Under "Additional configuration" set the "Missing data treatment" to "Treat missing data as good (not breaching threshold)"
1. For notification, create a new topic, `cdn-usage-alerts`
1. Add portwayalerts@bonkeybong.com to the recipients.
1. Add the topic
1. Click Next, then name the alarm, eg "CDN Usage at 10%"
1. Preview and create the alarm

Repeat these steps for each alarm threshold desired

## Disabling CloudFront CDN for an org

1. Navigate to the Cloudfront distribution
1. Select the "Behaviors" tab and Create a new Behavior
1. For the path pattern, enter the org ID hash followed by a forward slash and asterisk: `yk4ow93/*`
1. Leave the same origin as the default behavior (the S3 bucket)
1. Add a "Lambda Function Associations"
1. Choose CloudFront Event "Origin Request"
1. Enter the Lambda Function ARN, _with_ the version appended, eg: `arn:aws:lambda:...:2382932:2` where `:2` at the end is a colon followed by the version
1. Do not include the body. The lambda function just returns a 403
1. Save it, and ensure the Behavior executes before the Default Behavior