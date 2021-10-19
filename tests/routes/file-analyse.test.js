const request = require(`${process.cwd()}/tests/fixtures/request`)
process.env.TEST_SUITE = __filename

describe('POST /', () => {
    test('happy path', async () => {
        // Prepare
        const buffer = Buffer.from('test data')

        // Request
        let res = await request
            .post('/api/file-analyse')
            .attach('upfile', buffer, { filename: 'test.txt' })

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            name: 'test.txt',
            type: 'text/plain',
            size: 9
        })
    })

    test('invalid field name', async () => {
        // Prepare
        const buffer = Buffer.from('test data')

        // Request
        let res = await request
            .post('/api/file-analyse')
            .attach('wrong_field_name', buffer, { filename: 'test.txt' })

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
    })

    test('No file input', async () => {
        // Request
        let res = await request
            .post('/api/file-analyse')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(500)
        expect(res.headers['content-type']).toMatch(/json/)
    })
})