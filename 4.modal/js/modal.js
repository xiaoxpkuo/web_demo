$(function() {
    $("#name").blur(function() {
        if ($("#name").val() == ""){
            $("#NameErrorMessage").text("登录名称不能为空");
        }
        else {
            $("#NameErrorMessage").text("");
        }
    });
    $("#password").blur(function() {
        if ($("#password").val() == ""){
            $("#psErrorMessage").text("登录密码不能为空");
        }
        else {
            $("#psErrorMessage").text("");
        }
    });
});