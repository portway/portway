# Assets Storage and CDN

We use Cloudfront as our Content Delivery Network (CDN) and store assets on S3.

**Setup Steps**

1. Setup S3. Needs documentation.
1. Generate IAM user with S3 read/write access and generate keys for use by Portway. Needs documentation.
1. Create a Cloudfront Distribution
  1. Use distribution type "web"
  1. Generate the Origin Domain Name using the S3 URL + region
  1. Leave default settings for protocols, allowed methods, etc.
  1. Customize "Object Caching"
  1. Set the Minimum TTL to 86400 (1 day, in seconds)
  1. Turn on "Compress Objects Automatically"
  1. Choose the appropriate price class. For production, "Use All Edge Locations"
  1. Pick the domain name for the assets. Should be a subdomain of portwaycontent.com. Enter this in the "Alternate Domain Names (CNAMEs)" field
  1. Choose "Custom SSL Certificate" and then "Request or Import a Certificate with ACM"
    - ACM will walk you through steps to verify the domain
  1. Create the distribution
  1. The distribution now has a url. In Hover, update the subdomain's CNAME to point to the Cloudfront url