const $RefParser = require("@apidevtools/json-schema-ref-parser")
const fs = require('fs')

$RefParser.bundle('./docs/index.yaml', (err, schema) => {
    if (!err) {
        fs.writeFileSync('./docs/openapi.json', JSON.stringify(schema))
        console.log('Documentation generated')
    }
    else {
        console.error(err)
    }
})