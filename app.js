var propsCount = 0
$(document).ready(function () {
    addPropForm()
    //Mensaje de aviso
    $('body').on('focusout','.check-input', function (event) {
        $("#result")[0].innerText = getClassText()
        if (event.target.value != "") {
            let result = trimWhitespaces(event.target.value)
            
            event.target.value = result
            if (event.target.id == "class-name") {
                if (!isUpperCase(result[0])) {
                    $(event.target).after(`<div class="warning">Las clases tiene empezar en mayúsculas!</div>`);
                    $(".warning").delay(1000).fadeOut()
                }
            } else {
                if (isUpperCase(result[0])) {
                    $(event.target).after(`<div class="warning">Los atributos tiene empezar en minúsculas!</div>`);
                    $(".warning").delay(1000).fadeOut()
                }
            }
        }
    });

    $("#download").click(function (e) {
        if ($("#class-name")[0].value != "") {
            var text = getClassText()
            var filename = $("#class-name")[0].value+".java"
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
          
            element.style.display = 'none';
            document.body.appendChild(element);
          
            element.click();
          
            document.body.removeChild(element);
        } else {
            alert("Ponle nombre a la clase!")
        }
    });

    //Añadir form de propiedades
    $("#add").click(function () { 
        addPropForm()
    })

    //Cambios en el input de propiedad
    $('body').on('change','.property-type', function (event) {
    // $('.property-type').on('change', function(event) {
        var parent = event.target.parentElement
        var id = event.target.id
        if (this.value == "custom") {
            $(event.target).replaceWith(`<input type="text" name="property-type" id="`+id+`" class=""></input>`).append("dvsvds")
            let button = document.createElement("div")
            button.id = id
            button.classList.add("property-type-close-button")
            button.append("X")
            parent.append(button)

        }
            
    });

    $('body').on('click','.property-type-close-button', function (event) {
        var parent = event.target.parentElement
        var id = event.target.id
        var select = 
        `
        <select name="property-type" class="property-type" id="`+id+`">
            <option value="int">int</option>
            <option value="String">String</option>
            <option value="boolean">boolean</option>
            <option value="char">char</option>
            <option value="custom">custom</option>
        </select>
        `
      
        $("#"+id).replaceWith("")
        $(event.target).replaceWith("")
        $(parent).append(select)
    })
})

function getClassText() {
    var props = getPropsArray()
    var classText = ""

    //Crear clase
    classText += "public static class "+$("#class-name")[0].value+" {\n"

    //Crear atributos
    props.forEach(e => {
        if (e["property-name"] != ""  && e["property-type"] != "") {
            classText +="    "+ e["accesibility"] + " " + e["property-type"] + " " + e["property-name"] + ";\n"
        }
    });

    classText += "\n"

    //Crear setters y getters
    props.forEach(e => {
        if (e["setter"] != null) {
            classText += "    public void set"+capitalizeText(e["property-name"])+ "("+ e["property-type"] + " " +e["property-name"]+") {\n"
            classText += "       this."+e["property-name"]+" = "+e["property-name"]+";\n"
            classText += "    }\n\n"
        }
        if (e["getter"] != null) {
            classText += "    public "+ e["property-type"] + " get"+capitalizeText(e["property-name"])+ "() {\n"
            classText += "        return "+e["property-name"]+";\n"
            classText+="    }\n\n"
        }
    });

    //Fin
    classText += "}"
    return classText
}

function getPropsArray() {
    var props = []
    $(".property").each((i, value) => {
        let prop = []
        let skipProp = false
        $(value).serializeArray().forEach(element => {
            if (element.value == "") {
                skipProp = true
            }
        });
        if (!skipProp) {
            $(value).serializeArray().forEach(element => {
                var name = element.name
                var value = element.value
                prop[name] = value
            });
            props.push(prop)
        }
    });

    return props
}

function addPropForm() {
    var form = 
    `
    <hr/>
    <form action="" method="post" class="property">
        <div class="input">
            <label class="inputLabel" for="">Property name: </label>
            <input type="text" name="property-name" id="name`+propsCount+`" class="check-input" >
        </div>
        <div class="input">
            <label class="inputLabel" for="">Property type: </label>
            <select name="property-type" class="property-type" id="type`+propsCount+`">
                <option value="int">int</option>
                <option value="String">String</option>
                <option value="boolean">boolean</option>
                <option value="char">char</option>
                <option value="custom">custom</option>
            </select>
        </div>
            
        <div class="accessibility-container input">
            <label class="inputLabel">Accessibility: </label>
            <div>
                <input type="radio" id="public`+propsCount+`" name="accesibility" value="public" checked class="check-input">
                <label for="public`+propsCount+`">public</label> 
            </div>
            <div>
                <input type="radio" id="private`+propsCount+`" name="accesibility" value="private" class="check-input">
                <label for="private`+propsCount+`">private</label> 
            </div>
            <div>
                <input type="radio" id="protected`+propsCount+`" name="accesibility" value="protected" class="check-input">
                <label for="protected`+propsCount+`">protected</label> 
            </div>
        </div>
        <div class="accessibility-container input">
            <label for="" class="inputLabel">Methods: </label>
            <div>
                <input type="checkbox" id="setter`+propsCount+`" name="setter" value="setter" class="check-input">
                <label for="setter`+propsCount+`">setter</label>
            </div>
            <div>
                <input type="checkbox" id="getter`+propsCount+`" name="getter" value="getter" class="check-input">
                <label for="getter`+propsCount+`">getter</label>
            </div>
        </div>
        
    </form>
    `
    propsCount++
    $("#content").append(form)
}

function capitalizeText(text) {
    return text[0].toUpperCase()+text.substr(1)
}

function isUpperCase(text) {
    return text == text.toUpperCase()
}

function trimWhitespaces(text) {
    return text.replace(/\s/g, '')
}