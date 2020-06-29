import { CloudFrontResponseHandler } from 'aws-lambda'

export const handler: CloudFrontResponseHandler = async (event) => {
    const response = event.Records[0].cf.response
    response.headers['x-demo-key'] = [{
        key: 'x-demo-lambda-key',
        value: "added from lambda edge"
    }]
    return response
}