 
$("form").submit(function (e) {
    e.preventDefault();
  });

  if(window.location.pathname === '/core/login/c'){ url = '/core/login/in/c'; document.title = 'College Login'}
  if(window.location.pathname === '/core/login/s'){ url = '/core/login/in/s'; document.title = 'Student Login'}
  if(window.location.pathname === '/core/login/f') {url = '/core/login/in/f'; document.title = 'Faculty Login'}
  if(window.location.pathname === '/core/login/p') {url = '/core/login/in/p'; document.title = 'Proctor Login'}
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
        if(window.location.pathname === '/core/login/c' || window.location.pathname === '/core/login/c/'){ url = '/core/login/in/c';}
        if(window.location.pathname === '/core/login/s' || window.location.pathname === '/core/login/s/'){ url = '/core/login/in/s';}
        if(window.location.pathname === '/core/login/f' || window.location.pathname === '/core/login/f/') {url = '/core/login/in/f'; }
        if(window.location.pathname === '/core/login/p' || window.location.pathname === '/core/login/p/' ) {url = '/core/login/in/p'; }
        $.ajax({
            type: "post",
            url,
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
                  alert("Login Invalid or Email Verification Pending")
              }
            }
        });
    } catch (e){
        alert('some error occured' + e)
    }
  };
  
  $("#submit").on("click", () => {
    performLogin();
  });