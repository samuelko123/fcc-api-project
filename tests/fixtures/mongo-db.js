const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const db = require(`${process.cwd()}/db`)

beforeAll(async () => {
    global.mongo_server = await MongoMemoryServer.create()
    const uri = await global.mongo_server.getUri()
    await db.connect(uri)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await global.mongo_server.stop()
})

beforeEach(async () => {
    await db.clear()
})