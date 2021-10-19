const db = require(`${process.cwd()}/db`)
process.env.TEST_SUITE = __filename

describe('connect to database', () => {
    test('console will log the error', async () => {
        let spy = {}
        spy.console = jest.spyOn(console, 'error').mockImplementation(() => { })
        await db.connect('invalid-mongo-uri')
        expect(spy.console).toHaveBeenCalled()
        spy.console.mockRestore()
    })
})
