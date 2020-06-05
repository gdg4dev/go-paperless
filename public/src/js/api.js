const callAPI = (dataToSend, responseDataCB) => {
    authToken = Cookies.get('token')
    if (!authToken) {
        alert('Unauthorised Action')
        document.cookie = ''
        return window.location.reload()
    } else {
        encryptPayload = (pt) => {
            key = crypto.enc.Hex.parse('57c9a5a9adcb1dace1e2980d9ebe281ac0e6c54212b126a573f1dec35d33b26dd9371fab960a571ce71bdb537b52b39e2b806619a3be1dbc5c8d681948710cedbdab6cead96775cb57828ad58959becaac6a21029dfb695d00f0a96140f18226071049e1ebacc65780b141d03f636807b23de1e8ab53e795e384a628814ef3efcc3ee2247d1bc3db6b54e17075bf83b1c3bdb491c8b8e31d2098f52706b9ee721719fb0e5c1c7ec820d8d360be2fb52305f7a254a0a3c6c3257375dd1862460a82a924854e3239e327d98c38eaf2ac9dd850eea31764fd0a59546035f33c712bb203930f7f6aa06e4736b1ada65a7f9ed65a6d8e7299edda3b6b8c18d44707d1df59b952e2a215b98f0b4ae34edc6ce9871395110f0eb8cccee5246f29f32727810ee2768d3b11948fc9fcf53166699c2cde0e274eeac03941be9281e086efbe208ebf4d398c6b3b2570deb1de4d2e5479494eb40689a5132cfcbab19a03f6573ae1e688373e4855a19c0e4b7d17b45bd79bf1d296850220dc1e4d90815500f1dbe8448aa9106ab216083b668eebcfdbd73ad5576c875a0e99bee29ca5d8303726211a70a47b977767e82bd8affeaa0bdb5c993a453b922b1d4c6bcd9132f3197104972eb7796e69d2b4a8ce0d2f58b23d589812fbeb4f823412994ee77e4faf0ae5df818cbd6891d68a1e0b3bb981188f3b7e6df9e867f04571a4c3213166af')
            return crypto.AES.encrypt(pt.toString(), key).toString()
        }
        decryptResponse = (cipher) => {
            key = crypto.enc.Hex.parse('1c9fdef7ecf4f7dc93423ff33cd092e34e104882bb1b934a73d585ac68b7c872d084e22ebc82421131a4a1e48c20c335de95ebb323fbeff118ef7c2332a98482319762e1fceaafd2e1c848bd6a036b8136dcbc4fbf3a1174d4814fd6a46bd1d231aab81f21167a2ad8a4f0818b2d0fb0fe277ad346f7d80397b4af581c12daf3eefa67b7cc0222fd3ed7b494baac4e7fabb0682384e8e3bd56905a9a124c7cad48993ab5b38201f34f25b0b2ed531924d859010dd6fdf711b2332a5e8f5b4493a459c49aefd579d5511ecb8b4da364582cf73a6cdf9e61792e9634ec5c2c5e474406571c044e2d07bb69b8e3d8355f7b63e75b11a2c20df92335e4031dae6408aa2afb93ade0581a6fc641d5cc94ce43514338d2da3dd45ac953bf2d224324c83a3a685390b141bd65baf85e941a5511d35d14ac615687d12fc5bcb7264fabeb4630bb7ee2a6d0350e5c29c2abc70de82e924193f4fade43744d36ab6adb99a3e9d20e596b8052886db962d898c9700ccaac142e0e197be85a6a0ce6e1c0dedc4fb77030a1aa94f1591596a572467ea2758041fa879f8f4180f64c7a1feaebe0ad65f77b2c14f4f842724f21769c64aaf17a5843cbdbc7d2264023a97950e972f2df80a9129580911ab81a65d35a5feaed606d3082fe08a11c97afdadcb1c625800426fdcd879145f4d33c1439942a412917f6010cc84204ffab248046709210')
            var Bytes = crypto.AES.decrypt(cipher.toString(), key);
            return Bytes.toString(crypto.enc.Utf8);
        }
        $.ajax({
            type: "post",
            url: "/api/v1",
            data: {
                "payload": dataToSend
            },
            headers: {
                "Authorization": `Bearer ${authToken}`
            },
            success: function (response) {
                if (response.error) return alert(response.message);
                try{
                    decryptedResponse = decryptResponse(response)
                    return responseDataCB(decryptedResponse)
                }catch(e){
                    return alert('something went wrong!')
                }
            }
        });
    }
}