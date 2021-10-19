const request = require(`${process.cwd()}/tests/fixtures/request`)
const empty = require(`${process.cwd()}/utils/empty`)
process.env.TEST_SUITE = __filename

describe('error handling', () => {
    test('404 - respond with Not Found', async () => {
        // Request
        let res = await request.get('/no-such-path')

        // Assert
        expect(res.status).toEqual(404)
        expect(res.body).toEqual({
            error: 'Not Found'
        })
    })

    test('500 - console output the error', async () => {
        // Prepare
        jest.spyOn(empty, 'empty_fn').mockImplementation(() => {
            throw Error('Unexpected Error')
        })

        let spy = {}
        spy.console = jest.spyOn(console, 'error').mockImplementation(() => { })

        // Request
        let res = await request.get('/error-path')

        // Assert
        expect(res.status).toEqual(500)
        expect(res.body).toEqual(
            expect.objectContaining({
                error: 'Unexpected Error'
            })
        )
        expect(spy.console).toHaveBeenCalled()
    })
})