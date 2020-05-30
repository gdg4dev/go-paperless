const {uploadErrorHandlers, uploadSingleImage, uploadSingleDocument} = require('./utils')

exports.singleImageUploadHandler = (req,res)=>{
    uploadSingleImage(req,res,(e)=>{
        uploadErrorHandlers(req,res,e)
    })
}

exports.singleDocumentUploadHandler = (req,res)=>{
    uploadSingleDocument(req,res,(e)=>{
        uploadErrorHandlers(req,res,e)
    })
}

module.exports = exports