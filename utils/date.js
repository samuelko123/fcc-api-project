const regex_util = require('./regex')

exports.string_to_date = (x) => {
    // Convert string to int if it's digits (for unix timestamp)
    if(regex_util.isDigitOnly(x)) {
        x = parseInt(x, 10)
    }

    return new Date(x)
}

exports.date_to_timestamp = (x) => {
    let unix = x.getTime()
    let utc = new Date(x).toUTCString()
    return {unix: unix, utc: utc}
}