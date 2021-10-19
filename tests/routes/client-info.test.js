const request = require(`${process.cwd()}/tests/fixtures/request`)
process.env.TEST_SUITE = __filename

describe('GET /client-info', () => {
    test('happy path', async () => {
        // Request
        let res = await request
            .get('/api/client-info')
            .set('Accept', 'application/json')
            .set('X-Forwarded-For', '000.000.000.000')
            .set('Accept-Language', 'English')
            .set('User-Agent', 'Nothing')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            ipaddress: '000.000.000.000',
            language: 'English',
            software: 'Nothing'
        })
    })
})