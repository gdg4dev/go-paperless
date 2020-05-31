const {uploadErrorHandlers, uploadSingleImage, uploadSingleDocument} = require('./utils')

exports.singleImageUploadHandler = (req,res,uploadResponseCB)=>{
    uploadSingleImage(req,res,uploadResponseCB,(e)=>{
        uploadErrorHandlers(req,res,uploadResponseCB,e)
    })
}

exports.singleDocumentUploadHandler = (req,res)=>{
    uploadSingleDocument(req,res,(e)=>{
        uploadErrorHandlers(req,res,e)
    })
}

module.exports = exports