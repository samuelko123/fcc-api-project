const request = require(`${process.cwd()}/tests/fixtures/request`)
const date_util = require(`${process.cwd()}/utils/date`)
process.env.TEST_SUITE = __filename

describe('GET /:date_string', () => {
    test('input unix', async () => {
        // Prepare
        let test_data = 1580601600000

        // Request
        let res = await request
            .get('/api/timestamp/' + test_data)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            "unix": new Date(test_data).getTime(),
            "utc": new Date(test_data).toUTCString()
        })
    })

    test('input date string', async () => {
        // Prepare
        let test_data = '2020-03-03'

        // Request
        let res = await request
            .get('/api/timestamp/' + test_data)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            "unix": new Date(test_data).getTime(),
            "utc": new Date(test_data).toUTCString()
        })
    })

    test('invalid :date_string', async () => {
        // Prepare
        let test_data = 'it-is-not-a-date'

        // Request
        let res = await request
            .get('/api/timestamp/' + test_data)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual({
            'error': 'Invalid Date'
        })
    })
})