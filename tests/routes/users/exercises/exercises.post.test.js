const request = require(`${process.cwd()}/tests/fixtures/request`)
require(`${process.cwd()}/tests/fixtures/mongo-db`)
const users = require(`${process.cwd()}/models/users`)
process.env.TEST_SUITE = __filename

describe('POST /api/users/:user_id/exercises', () => {
    let existing_user_id

    beforeEach(async () => {
        let user_doc = await users.create({ username: 'existing_user' })
        existing_user_id = user_doc._id
    })

    test('happy path - respond with exercise json', async () => {
        // Prepare
        let test_data = {
            description: 'exercise1',
            duration: 100,
            date: '2000-01-01'
        }

        // Request
        let res = await request
            .post(`/api/users/${existing_user_id}/exercises`)
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(201)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                username: expect.any(String),
                description: expect.any(String),
                duration: expect.any(Number),
                date: expect.any(String),
            }))
    })

    test('happy path (with no date param, which is optional)', async () => {
        // Prepare
        let test_data = {
            description: 'exercise1',
            duration: 100,
        }

        // Request
        let res = await request
            .post(`/api/users/${existing_user_id}/exercises`)
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(201)
        expect(res.headers['content-type']).toMatch(/json/)
    })

    test('respond error if user does not exist', async () => {
        // Prepare
        let test_data = {
            description: 'exercise2',
            duration: 50
        }

        // Request
        let res = await request
            .post(`/api/users/no_such_user/exercises`)
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

    test('invalid param name', async () => {
        // Prepare
        let test_data = {
            desc: 'exercise3', // should be "description"
            duration: 50,
            date: '2000-01-01'
        }

        // Request
        let res = await request
            .post(`/api/users/${existing_user_id}/exercises`)
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
    })

    test('respond error for invalid input - invalid duration', async () => {
        // Prepare
        let test_data = {
            description: 'exercise3',
            duration: 'not-a-number',
            date: '2000-01-01'
        }

        // Request
        let res = await request
            .post(`/api/users/${existing_user_id}/exercises`)
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
    })

    test('respond error for invalid input - invalid date', async () => {
        // Prepare
        let test_data = {
            description: 'exercise3',
            duration: 50,
            date: 'it-is-not-a-date'
        }

        // Request
        let res = await request
            .post(`/api/users/${existing_user_id}/exercises`)
            .set('Accept', 'application/json')
            .send(test_data)

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
    })
})