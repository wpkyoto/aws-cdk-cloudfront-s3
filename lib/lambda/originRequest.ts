import { CloudFrontRequestHandler } from 'aws-lambda';
import { TSLoggerService } from '@wpkyoto/lambda-logger';

export const handler: CloudFrontRequestHandler = async (event, _context) => {
  const { logger } = TSLoggerService.getInstance({
    minLevel: 'error',
  }).setLambdaContext(_context);
  logger.info('event', JSON.stringify(event));
  // Extract the request from the CloudFront event that is sent to Lambda@Edge
  const request = event.Records[0].cf.request;
  logger.info('request', JSON.stringify(request));
  try {
    // Extract the URI from the request
    const olduri = request.uri;

    // Match any '/' that occurs at the end of a URI. Replace it with a default index
    const newuri = olduri.replace(/\/$/, '/index.html');

    // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
    logger.info('Old URI', olduri);
    logger.info('New URI', newuri);

    // Replace the received URI with the URI that includes the index page
    request.uri = newuri;
    return request;
  } catch (e) {
    logger.error(e);
    return request;
  }
};
