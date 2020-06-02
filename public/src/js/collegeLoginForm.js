 
$("form").submit(function (e) {
    e.preventDefault();
  });
  const performLogin = () => {
    e = $("#email").val();
    p = $("#pass").val();
    email = CryptoJS.AES.encrypt(
      e.toString(),
      "MaILEncrYptIoNKey919@dwq343f#"
    ).toString();
    pass = CryptoJS.AES.encrypt(
      p.toString(),
      "MaILEncrYptIoNKey919@dwq343f#"
    ).toString();
    try{
        $.ajax({
            type: "post",
            url: "/core/login/in/c",
            data: { email, pass },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            success: function (response) {
              //   console.log(response);
                eval(response.NEXT)
                responseData()
            },
            statusCode: {
              429: ()=>{
                alert( "TOO MANY ATTEMPTS! PLEASE TRY AGAIN LATER" );
              },
              403: ()=>{
                  alert("Login Invalid")
              }
            }
        });
      // $.post("/core/login/in/c", , function (
      //     data,
      //     textStatus,
      //     jqXHR
      //   ) {
      //     if (textStatus === "success") {
      //         if (jqXHR.status === 200) {
      //          eval(data.NEXT);
      //          responseData();
      //         }
      //          else alert('Login Invalid');
      //     } else {
      //         alert(`there is something wrong with your network or request`);
      //     }
      //   })
    } catch (e){
  
      //   console.log('Something Wrong With Request');
      //   console.log(e)
    }
  };
  
  $("#submit").on("click", () => {
    performLogin();
  });