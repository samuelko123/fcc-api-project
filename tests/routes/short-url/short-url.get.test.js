const request = require(`${process.cwd()}/tests/fixtures/request`)
require(`${process.cwd()}/tests/fixtures/mongo-db`)
const urls = require(`${process.cwd()}/models/urls`)
process.env.TEST_SUITE = __filename

describe('GET /:url_id', () => {
    beforeEach(async () => {
        await urls.create({
            url_id: 1,
            url_text: 'https://google.com'
        })
    })

    test('happy path - redirect url', async () => {
        // Request
        let res = await request
            .get('/api/short-url/1')
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(302)
        expect(res.headers['location']).toEqual('https://google.com')
    })

    test('non-existent url - expect error', async () => {
        // Request
        let res = await request
            .get('/api/short-url/123')
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(404)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            error: 'URL does not exist'
        })
    })
})