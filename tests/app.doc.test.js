const request = require(`${process.cwd()}/tests/fixtures/request`)
process.env.TEST_SUITE = __filename

describe('doc json', () => {
    test('returns openapi json', async () => {
        // Request
        let res = await request
            .get('/docs/openapi.json')
            .set('Accept', 'application/json')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
    })
})