const request = require(`${process.cwd()}/tests/fixtures/request`)
require(`${process.cwd()}/tests/fixtures/mongo-db`)
process.env.TEST_SUITE = __filename

describe('POST /', () => {
    test('happy path - return short url', async () => {
        // Prepare
        let test_data = { url: 'https://www.microsoft.com/' }

        // Request
        let res1 = await request
            .post('/api/short-url')
            .set('Accept', 'application/json')
            .send(test_data)

        let res2 = await request
            .post('/api/short-url')
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res1).toSatisfyApiSpec()
        expect(res1.status).toEqual(201)
        expect(res1.headers['content-type']).toMatch(/json/)
        expect(res1.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                original_url: test_data.url,
                short_url: 1,
            })
        )

        expect(res2).toSatisfyApiSpec()
        expect(res2.status).toEqual(201)
        expect(res2.headers['content-type']).toMatch(/json/)
        expect(res2.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                original_url: test_data.url,
                short_url: 2,
            })
        )
    })

    test('invalid field', async () => {
        // Prepare
        let test_data = { invalid_field: 'https://google.com' }

        // Request
        let res = await request
            .post('/api/short-url')
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            error: 'Invalid URL'
        })
    })

    test('invalid url', async () => {
        // Prepare
        let test_data = { url: 'no-such-url' }

        // Request
        let res = await request
            .post('/api/short-url')
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            error: 'Invalid URL'
        })
    })
})