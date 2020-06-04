const crypto = require("crypto-js");
// // performs AES encryption
exports.encrypt2 = (pt, key) => {
    console.log(pt);
    return crypto.AES.encrypt(pt.toString(), key).toString();
};

exports.decrypt2 = (cipher, key) => {
    // console.log(` cipher: ${cipher}`);
    // console.log(` key: ${key}`);
    var Bytes = crypto.AES.decrypt(cipher.toString(), key);
    return Bytes.toString(crypto.enc.Utf8);
};

exports.encrypt = (pt, key) => {
    key = crypto.enc.Hex.parse(key);
    //   console.log('enckry' + key);
    return crypto.AES.encrypt(pt, key, {
        mode: crypto.mode.ECB
    }).toString();
};

exports.decrypt = (cipher, key) => {
    key = crypto.enc.Hex.parse(key || process.env.GP_PRIVATE_ENC_DEC_KEY);
    //   console.log(` cipher: ${cipher}`);
    //   console.log(` key: ${key}`);
    return crypto.AES.decrypt(cipher.toString(), key, {
        mode: crypto.mode.ECB,
    }).toString(crypto.enc.Utf8);
};

exports.toPrivateData = (cipher) => {
    publicDataDecrypt = exports.decrypt2(cipher.toString(), `${process.env.GP_PUB_ENC_DEC_KEY}`);
    privateDataEncrypt = exports.encrypt(publicDataDecrypt.toString(), `${process.env.GP_PRIVATE_ENC_DEC_KEY}`);
    return privateDataEncrypt;
};

exports.toPublicData = (cipher) => {
    privateDataDecrypt = exports.decrypt(cipher.toString(), `${process.env.GP_PRIVATE_ENC_DEC_KEY}`);
    console.log(privateDataDecrypt);
    publicDataEncrypt = exports.encrypt2(privateDataDecrypt.toString(), `${process.env.GP_PUB_ENC_DEC_KEY}`);
    return publicDataEncrypt;
};

exports.decryptRSA = (cipher) =>{
        var absolutePath = path.resolve(path.join(__dirname, '../../../private/private.pem'));
        var privateKey = fs.readFileSync(absolutePath, "utf8");
        var buffer = Buffer.from(cipher, "base64");
        var decrypted = crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString("utf8");
}

module.exports = exports