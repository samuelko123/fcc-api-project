const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports.connect = async (uri) => {
    try {
        await mongoose
            .connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })

        console.log('Connected to database')
    } catch (err) {
        console.error(`Error connecting to database - ${err}`)
    }
}

module.exports.clear = async () => {
    const collections = Object.keys(mongoose.connection.collections)
    for (let name of collections) {
        let collection = mongoose.connection.collections[name]
        await collection.deleteMany()
    }
}