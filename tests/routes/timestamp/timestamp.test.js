const request = require(`${process.cwd()}/tests/fixtures/request`)
const date_util = require(`${process.cwd()}/utils/date`)
process.env.TEST_SUITE = __filename

describe('GET /', () => {
    test('respond with current date', async () => {
        // Prepare
        let test_data = '2020-01-01'
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return test_data
        })

        // Request
        let res = await request
            .get('/api/timestamp')
            .set('Accept', 'application/json')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res).toSatisfyApiSpec()
        expect(res.body).toEqual({
            "unix": new Date(test_data).getTime(),
            "utc": new Date(test_data).toUTCString()
        })
    })

    test('handle unexpected error', async () => {
        // Prepare
        jest.spyOn(date_util, 'date_to_timestamp').mockImplementation(() => {
            throw new Error('Unexpected Error')
        })

        // Request
        let res = await request
            .get('/api/timestamp')
            .set('Accept', 'application/json')

        // Assert
        expect(res.status).toEqual(500)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res).toSatisfyApiSpec()
        expect(res.body).toEqual({
            'error': 'Unexpected Error'
        })
    })
})