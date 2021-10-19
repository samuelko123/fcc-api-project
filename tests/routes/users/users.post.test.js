const request = require(`${process.cwd()}/tests/fixtures/request`)
require(`${process.cwd()}/tests/fixtures/mongo-db`)
const users = require(`${process.cwd()}/models/users`)
process.env.TEST_SUITE = __filename

describe('POST /api/users', () => {
    beforeEach(async () => {
        await users.create({ username: 'existing_user' })
    })

    test('respond with json containing the new user', async () => {
        // Prepare
        let test_data = { username: 'new_user' }

        // Request
        let res = await request
            .post('/api/users')
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(201)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                username: test_data.username
            })
        )
    })

    test('respond with error if user already exists', async () => {
        // Prepare
        let test_data = { username: 'existing_user' }

        // Request
        let res = await request
            .post('/api/users')
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(
            expect.objectContaining({
                error: expect.any(String)
            })
        )
    })

    test('respond with error for invalid input', async () => {
        // Prepare
        let test_data = { name: 'new_user' } // should be "username"

        // Request
        let res = await request
            .post('/api/users')
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(
            expect.objectContaining({
                error: expect.any(String)
            })
        )
    })
})