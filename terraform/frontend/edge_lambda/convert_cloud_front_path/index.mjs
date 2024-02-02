'use strict';

// 参考文献
// https://aws.amazon.com/jp/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
export const handler = (event, context, callback) => {
    
    // Extract the request from the CloudFront event that is sent to Lambda@Edge 
    var request = event.Records[0].cf.request;

    // Extract the URI from the request
    var olduri = request.uri;
    var newuri;
    // *.js, *.css等のリクエストはそのまま返す
    if (olduri.match(/\./g)) {
        newuri = olduri;
    } else {
        // Match any '/' that occurs at the end of a URI. Replace it with a default index
        newuri = olduri.replace(/(.*)\/$/, '$1') + '/index.html';
    }
    
    // Replace the received URI with the URI that includes the index page
    request.uri = newuri;
    
    // Return to CloudFront
    return callback(null, request);

};
