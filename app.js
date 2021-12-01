var propsCount = 0
//TODO depurar inputs
//TODO no repes inputs
//TODO avisar del formato
//TODO funciones primera letra mayus
$(document).ready(function () {
    addProp()
    $('body').on('mouseleave','.check-input', function (event) {
    // $( ".check-input" ).mouseleave(function(event) {
        // $(event.target.parentElement).append("eeee")
        $(event.target).after("eeee")
    });
    $("#update").click(function (e) { 
        var props = getProps()
        // var form = $("#class").serializeArray()
        var str = ""

        //Crear clase
        str += "public static class "+$("#class-name")[0].value+" {\n"

        //Crear atributos
        props.forEach(e => {
            str +="    "+ e["accesibility"] + " " + e["property-type"] + " " + e["property-name"] + ";\n"
        });

        str += "\n"

        //Crear setters y getters
        props.forEach(e => {
            if (e["setter"] != null) {
                str += "    public void set"+e["property-name"]+ "("+ e["property-type"] + " " +e["property-name"]+") {\n"
                str += "        this."+e["property-name"]+" = "+e["property-name"]+";\n"
                str += "    }\n\n"
            }
            if (e["getter"] != null) {
                str += "    public "+ e["property-type"] + " get"+e["property-name"]+ "() {\n"
                str += "        return "+e["property-name"]+";\n"
                str+="    }\n\n"
            }
        });

        //Fin
        str += "}"

        //Print
        window.str = str
        console.log(str)
        $("#result")[0].innerText = str
    });

    $("#add").click(function () { 
        addProp()
    })

    $('.property-type').on('change', function(event) {
        if (this.value == "custom") {
            console.log(event);
            var id = event.target.id
            $(event.target).replaceWith(`<input type="text" name="property-type" id="`+id+`" class="check-input"></input>`)
        }
      });
})

function getProps() {
    var props = []
    $(".property").each((i, value) => {
        let prop = []
        $(value).serializeArray().forEach(element => {
            var name = element.name
            var value = element.value
            prop[name] = value
        });
        props.push(prop)
    });

    return props
}

function addProp() {
    var form = 
    `
    <hr/>
    <form action="" method="post" class="property">
        <label for="">Property name </label><input type="text" name="property-name" id="name`+propsCount+`" class="check-input" >
        <label for="">Property type </label>
        <select name="property-type" class="property-type" id="type`+propsCount+`">
            <option value="int">int</option>
            <option value="String">String</option>
            <option value="boolean">boolean</option>
            <option value="char">char</option>
            <option value="custom">custom</option>
        </select>
        
        <div>Accesibility</div>
            <div>
                <input type="radio" id="public`+propsCount+`" name="accesibility" value="public" checked>
                <label for="public`+propsCount+`">public</label> 
            </div>
            <div>
                <input type="radio" id="private`+propsCount+`" name="accesibility" value="private">
                <label for="private`+propsCount+`">private</label> 
            </div>
            <div>
                <input type="radio" id="protected`+propsCount+`" name="accesibility" value="protected">
                <label for="protected`+propsCount+`">protected</label> 
            </div>
        <label for="">Methods 
            <div>
                <input type="checkbox" id="setter`+propsCount+`" name="setter" value="setter">
                <label for="setter`+propsCount+`">setter</label>
            </div>
            <div>
                <input type="checkbox" id="getter`+propsCount+`" name="getter" value="getter">
                <label for="getter`+propsCount+`">getter</label>
            </div>
        </label>
    </form>
    `
    propsCount++
    $("#content").append(form)
}