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
  $.post("/core/login/in/c", { email, pass }, function (
    data,
    textStatus,
    jqXHR
  ) {
    console.log(data);
    console.log(textStatus);
    console.log(jqXHR);
    if (textStatus === "success") {
        if (jqXHR.status === 200) {
         eval(data.NEXT);
         responseData();
        }
         else alert(data.message);
    } else {
        alert(`there is something wrong with your network or request`);
    }
  });
};

$("#submit").on("click", () => {
  performLogin();
});
