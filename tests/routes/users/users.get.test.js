const request = require(`${process.cwd()}/tests/fixtures/request`)
require(`${process.cwd()}/tests/fixtures/mongo-db`)
const users = require(`${process.cwd()}/models/users`)
process.env.TEST_SUITE = __filename

describe('GET api/users', () => {
    beforeEach(async () => {
        await users.create({ username: 'existing_user' })
    })

    test('respond with json containing a list of all users', async () => {

        // Request
        let res = await request.get('/api/users')
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    _id: expect.any(String),
                    username: expect.any(String)
                })
            ])
        )
    })

    test('test error handling', async () => {
        // Prepare
        jest.spyOn(users, 'find').mockImplementation(() => {
            throw new Error('db failed')
        })

        // Request
        let res = await request
            .get('/api/users')
            .set('Accept', 'application/json')

        // Asert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(500)
        expect(res.headers['content-type']).toMatch(/json/)
    })
})