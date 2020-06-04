const callAPI = (dataToSend,responseDataCB) => {
    authToken = Cookies.get('token')
    if (!authToken) {
        alert('Unauthorised Action')
        document.cookie = ''
        return window.location.reload()
    } else {
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
                return responseDataCB(response)
            }
        });
    }
}