const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1000 * 1000 }
})
const upload = uploader.single('upfile')

router.post('/', (req, res, next) => {
    // upload file
    upload(req, res, (err) => {
        try {
            if (err instanceof multer.MulterError) {
                err.status = 400
                throw err
            }

            // create output
            let output = {
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size
            }

            // send response
            res.json(output)
        } catch (err) {
            next(err)
        }
    })
})

module.exports = router