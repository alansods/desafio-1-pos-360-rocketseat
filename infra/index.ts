import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

// Get configuration
const config = new pulumi.Config();
const accountId = config.require("accountId");

// Create an R2 Bucket
const bucket = new cloudflare.R2Bucket("shortlinks-bucket", {
    accountId: accountId,
    name: "shortlinks-export-bucket", // You can change this name or make it dynamic
    location: "ENAM", // Eastern North America, or choose another region hint
});

// Export the bucket name and endpoint
export const bucketName = bucket.name;
export const bucketDomain = pulumi.interpolate`https://${accountId}.r2.cloudflarestorage.com/${bucket.name}`;
