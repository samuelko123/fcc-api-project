const request = require(`${process.cwd()}/tests/fixtures/request`)
require(`${process.cwd()}/tests/fixtures/mongo-db`)
const users = require(`${process.cwd()}/models/users`)
process.env.TEST_SUITE = __filename

describe('GET /api/users/:user_id/exercises', () => {
    let existing_user_id
    let existing_user_id_with_log
    let test_data = [{
        description: 'exercise1',
        duration: 100,
        date: '2000-01-01'
    }, {
        description: 'exercise2',
        duration: 200,
        date: '2000-02-01'
    }, {
        description: 'exercise3',
        duration: 300,
        date: '2000-03-01'
    }, {
        description: 'exercise4',
        duration: 400,
        date: '2000-04-01'
    }, {
        description: 'exercise5',
        duration: 500,
        date: '2000-05-01'
    }]

    beforeEach(async () => {
        let user_doc = await users.create({ username: 'existing_user' })
        existing_user_id = user_doc._id

        user_doc = await users.create({ username: 'test_user_with_exercises' })
        existing_user_id_with_log = user_doc._id

        for (let x of test_data) {
            await request
                .post(`/api/users/${existing_user_id_with_log}/exercises`)
                .set('Accept', 'application/json')
                .send(x)
        }
    })

    test('user has no exercise', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id}/exercises/`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                username: expect.any(String),
                count: 0,
                exercises: []
            })
        )
    })

    test('user has exercise', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises/`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body).toEqual(
            expect.objectContaining({
                _id: expect.any(String),
                username: expect.any(String),
                count: test_data.length,
                exercises: expect.arrayContaining([
                    expect.objectContaining({
                        description: expect.any(String),
                        duration: expect.any(Number),
                        date: expect.any(String)
                    })
                ])
            })
        )
    })

    test('parameter - [from]', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises?from=2000-02-01`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body.count).toEqual(4)
        expect(res.body.exercises.length).toEqual(4)
    })

    test('parameter - [to]', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises?to=2000-04-01`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body.count).toEqual(4)
        expect(res.body.exercises.length).toEqual(4)
    })

    test('parameter - [from] and [to]', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises?from=2000-02-01&to=2000-04-01`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body.count).toEqual(3)
        expect(res.body.exercises.length).toEqual(3)
    })

    test('parameter - [limit]', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises?limit=3`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(200)
        expect(res.headers['content-type']).toMatch(/json/)
        expect(res.body.count).toEqual(5) // give the count of all records
        expect(res.body.exercises.length).toEqual(3) // but limits record rows
    })

    test('parameter - invalid [from]', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises?from=not-a-date`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
    })

    test('parameter - invalid [to]', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises?to=not-a-date`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
    })

    test('parameter - invalid [limit]', async () => {
        // Request
        let res = await request
            .get(`/api/users/${existing_user_id_with_log}/exercises?limit=-1`)
            .set('Accept', 'application/json')

        // Assert
        expect(res).toSatisfyApiSpec()
        expect(res.status).toEqual(400)
        expect(res.headers['content-type']).toMatch(/json/)
    })
})