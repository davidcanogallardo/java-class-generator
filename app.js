//Uso durante todo el código propiedad en vez de atributo, 
//me di cuenta demasido tarde para arreglarlo
let propsCount = 1
let constructorCount = 1
$(document).ready(function () {
    appendAttributeToDom()
    $("#result")[0].innerText = getClassFormattedString()
    //Controla si se ha introducido un input incorrecto para avisar
    $('body').on('change focusout','.check-input', function (event) {
        if (event.target.value != "" && event.target.type !="select-one") {
            let result = trimWhitespaces(event.target.value)
            
            event.target.value = result
            if (event.target.id == "class-name" || event.target.id == "extends") {
                if (!isUpperCase(result[0])) {
                    $(event.target).after(`<div class="warning">Classes must start with capital letters</div>`);
                    $(".warning").delay(1000).fadeOut()
                }
            } else {
                if (isUpperCase(result[0])) {
                    $(event.target).after();
                    $(event.target).after(`<div class="warning">Attributes must start without capital letters</div>`);
                    $(".warning").delay(1000).fadeOut()
                }
            }
        }
    });

    $('body').on('blur click focusin focusout change','.check-input', function (event) {
        $("#result")[0].innerText = getClassFormattedString()
    })

    //Añadir atributo
    $("#add").click(function () { 
        appendAttributeToDom()
    })

    //Añadir constructor
    $("#addConstrutor").click(function () { 
        appendConstructorToDom()
    })

    //Controla cuando en el tipo de atributo se elige un custom
    $('body').on('change','.property-type', function (event) {
    // $('.property-type').on('change', function(event) {
        let parent = event.target.parentElement
        let id = event.target.id
        if (this.value == "custom") {
            $(event.target).replaceWith(`<input type="text" name="property-type" id="`+id+`" class="check-input"></input>`).append("dvsvds")
            let button = document.createElement("div")
            button.id = id
            button.classList.add("property-type-close-button")
            button.append("X")
            parent.append(button)

        }
            
    });

    //Controla cuando se quiere volver de atributo tipo custom a normal
    $('body').on('click','.property-type-close-button', function (event) {
        let parent = event.target.parentElement
        let id = event.target.id
        let select = 
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

    //Boton de borrar un constructor
    $('body').on('click','.deleteConstructor', function (event) {
        // if (event.target.id != "close1") {
            $(event.target.parentElement.parentElement).replaceWith()
        // }
    })

    //Boton de borrar un atributo
    $('body').on('click','.deleteProperty', function (event) {
        // if (event.target.id != "close1") {
            $(event.target.parentElement).replaceWith()
        // }
    })

    //Descargar la clase
    $("#download").click(function (e) {
        if ($("#class-name")[0].value != "") {
            if (getAttributesArray().length !=0) {
                let text = getClassFormattedString()
                let filename = $("#class-name")[0].value+".java"
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);
              
                element.style.display = 'none';
                document.body.appendChild(element);
              
                element.click();
              
                document.body.removeChild(element);
            } else {
                alert("Add a minimum of one attribute!")
            }
        } else {
            alert("A class must have a name!")
        }
    });

    //Previene que un form recargue la página
    $("form").submit(function(e) {
        e.preventDefault();
    });
})

function appendConstructorToDom() {
    let constructor = 
    `
    <form action="" method="post">
        <div class="input">
            <div class="deleteConstructor" id="close`+constructorCount+`">x</div>
    `
    let props = getAttributesArray()
    if (props.length != 0) {
        props.forEach(e => {
            if (e["property-name"] != ""  && e["property-type"] != "") {
                console.log("dsfgs");
                constructor += `            
                <div>
                    <input id="`+e["property-name"]+constructorCount+`" type="checkbox" name="`+e["property-name"]+`" value="`+e["property-name"]+`" class="check-input" checked>
                    <label for="`+e["property-name"]+constructorCount+`">`+e["property-name"]+`</label>
                </div>`
            }
        });
    
        constructor+= `</div></form>`
        $("#constructors").append(constructor)
        constructorCount++
        $("#result")[0].innerText = getClassFormattedString()
    }
}

function getClassFormattedString() {
    let props = getAttributesArray()
    let classText = ""
    let extendsText = ""
    let implementsText = ""

    if ($("#extends").val() != "") {
        extendsText = " extends "+$("#extends").val()
    }
    if ($("#implements").val() != "") {
        implementsText = " implements "+$("#implements").val()
    }
    //Crear cabecera clase
    classText += "public class "+$("#class-name")[0].value+extendsText+" "+implementsText+" {\n"

    //Crear definición de atributos
    props.forEach(e => {
        if (e["property-name"] != ""  && e["property-type"] != "") {
            classText +="    "+ e["accesibility"] + " " + e["property-type"] + " " + e["property-name"] + ";\n"
        }
    });
    classText += "\n"

    //Crear constructores
    let constructors = getConstructorsArray()

    if (constructors.length != 0) {
        constructors.forEach(construct => {
            classText +="    public "+$("#class-name")[0].value+"("
            construct.forEach(property => {
                props.forEach((e,index) => {
                    if (e["property-name"] == property) {
                        if (index+1 != props.length) {
                            classText +=e["property-type"]+" "+e["property-name"]+", "
                        } else {
                            classText +=e["property-type"]+" "+e["property-name"]
                        }
                    }
                });
            });
            
            classText += ") {\n"
    
            construct.forEach(property => {
                props.forEach(e => {
                    if (e["property-name"] == property) {
                        classText +="        this."+e["property-name"]+" = "+e["property-name"]+";\n"
                    }
                });
            });
            classText += "    }\n\n"
        });
    } else {
        classText += `    public `+$("#class-name")[0].value+`(){\n    }\n\n`
    }

    //Crear setters y getters
    props.forEach(e => {
        if (e["setter"] != null) {
            classText += "    public void set"+capitalizeText(e["property-name"])+ "("+ e["property-type"] + " " +e["property-name"]+") {\n"
            classText += "       this."+e["property-name"]+" = "+e["property-name"]+";\n"
            classText += "    }\n\n"
        }
        if (e["getter"] != null) {
            classText += "    public "+ e["property-type"] + " get"+capitalizeText(e["property-name"])+ "() {\n"
            classText += "        return this."+e["property-name"]+";\n"
            classText+="    }\n\n"
        }
    });

    //Fin
    classText += "}"
    return classText
}

function getConstructorsArray() {
    let contrustorArray = []
    $("#constructors form").each((i, value) => {
        let constructor = []
        $(value).serializeArray().forEach(element => {
            // console.log(element);
            constructor.push(element.name)
        })
        contrustorArray.push(constructor)
    });
    return contrustorArray
}

function getAttributesArray() {
    let props = []
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
                let name = element.name
                let value = element.value
                prop[name] = value
            });
            props.push(prop)
        }
    });

    return props
}

function appendAttributeToDom() {
    let form = 
    `
    <form action="" method="post" class="property">
        <hr/>
        <div id="close`+propsCount+`" class="deleteProperty">X</div>
        <div class="input">
            <label class="inputLabel" for="">Property name: </label>
            <input type="text" name="property-name" id="name`+propsCount+`" class="check-input" >
        </div>
        <div class="input">
            <label class="inputLabel" for="">Property type: </label>
            <select name="property-type" class="property-type check-input" id="type`+propsCount+`">
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
    $("#form-container").append(form)
}

///Utils
function capitalizeText(text) {
    return text[0].toUpperCase()+text.substr(1)
}

function isUpperCase(text) {
    return text == text.toUpperCase()
}

function trimWhitespaces(text) {
    return text.replace(/\s/g, '')
}