$(document).ready(function () {
    $("#update").click(function (e) { 
        var form = $("#class").serializeArray()
        var str = ""
        form.forEach(element => {
            if (element.name == "class-name") {
                str += "public static class "+element.value+" {\n}"
            }
        });
        $(".property").each((i, value) => {
            console.log(value);
        });
    
        str += "}"
        console.log("sggs");
        $("#result")[0].innerText = str
        
    });
})