const supertest = require('supertest')
const app = require(`${process.cwd()}/app`)
const request = supertest(app)

const jestOpenAPI = require('jest-openapi')
jestOpenAPI.default(`${process.cwd()}/docs/openapi.json`)

beforeEach(async () => {
    await jest.restoreAllMocks()
})

module.exports = request