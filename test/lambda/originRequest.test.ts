import { handler } from '../../lib/lambda/originRequest';
import { CloudFrontRequestEvent, Context } from 'aws-lambda';

const getEvent = (uri: string): CloudFrontRequestEvent => {
  return ({
    Records: [
      {
        cf: {
          config: {
            distributionId: 'EXAMPLE',
          },
          request: {
            uri,
            method: 'GET',
            clientIp: '2001:cdba::3257:9652',
            headers: {
              'user-agent': [
                {
                  key: 'User-Agent',
                  value: 'Test Agent',
                },
              ],
              host: [
                {
                  key: 'Host',
                  value: 'd123.cf.net',
                },
              ],
              cookie: [
                {
                  key: 'Cookie',
                  value: 'SomeCookie=1; AnotherOne=A; X-Experiment-Name=B',
                },
              ],
            },
          },
        },
      },
    ],
  } as any) as CloudFrontRequestEvent;
};

describe('origin-request', () => {
  let request: CloudFrontRequestEvent;
  beforeEach(() => (request = getEvent('/test')));
  it('should pass throw by default', async () => {
    await expect(handler(request, {} as Context, {} as any))
        .resolves.toEqual(request.Records[0].cf.request)
  });
  it('should replace /test/ to /test/index.html', async () => {
    request = getEvent('/test/')
    const expected =  getEvent('/test/index.html')
    await expect(handler(request, {} as Context, {} as any))
        .resolves.toEqual(expected.Records[0].cf.request)
  })
  it('should not throw error when given invalid props, should pass throw', async () => {
    request = getEvent(undefined as any)
    await expect(handler(request, {} as Context, {} as any))
        .resolves.toEqual(request.Records[0].cf.request)
  })
});
