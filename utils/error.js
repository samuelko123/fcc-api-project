function CustomError(status, message){
    this.status = status
    this.message = message
}

CustomError.prototype = {
    constructor: Error
}

module.exports = { CustomError }