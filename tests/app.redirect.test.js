const request = require(`${process.cwd()}/tests/fixtures/request`)
process.env.TEST_SUITE = __filename

describe('app redirect', () => {
    test('302', async () => {
        // Request
        let res = await request
            .get('/')
            .set('Accept', 'application/json')

        // Assert
        expect(res.status).toEqual(302)
        expect(res.headers['location']).toEqual('/docs')
    })
})