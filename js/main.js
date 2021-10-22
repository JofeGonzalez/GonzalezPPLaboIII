var xhttp = new XMLHttpRequest();
var xhttp2 = new XMLHttpRequest();
var MaleCB = document.getElementById("MaleCB");
var FemaleCB = document.getElementById("FemaleCB");
var loc;
window.addEventListener("load", loader());

function closeForm() {
  var cerrar = document.getElementById("containerForm");
  cerrar.style.cssText = "visibility: hidden;";
}

function logText(object) {
  var nombre = document.getElementById("name");
  var apellido = document.getElementById("lastname");
  nombre.value = object.parentElement.cells[0].innerText;
  apellido.value = object.parentElement.cells[1].innerText;
  if (object.parentElement.cells[3].innerText == "Female") {
    FemaleCB.checked = true;
    MaleCB.checked = false;
  } else {
    MaleCB.checked = true;
    FemaleCB.checked = false;
  }
}

function openForm() {
  var cerrar = document.getElementById("containerForm");
  cerrar.style.cssText = "visibility: initial;";
}

MaleCB.addEventListener("change", function () {
  if (FemaleCB.checked) {
    FemaleCB.checked = false;
  }
});

FemaleCB.addEventListener("change", function () {
  if (MaleCB.checked) {
    MaleCB.checked = false;
  }
});

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let respuesta = this.response;
    let vector = JSON.parse(respuesta);
    vector.forEach((Element) => {
      fillPeopleTable(Element);
    });
  }
};
xhttp.open("GET", "http://localhost:3000/personas", true);
xhttp.send();

function fillPeopleTable(persona) {
  var row =
    "<tr><td onclick='logText(this)'>" +
    persona.nombre +
    "</td><td onclick='logText(this)'>" +
    persona.apellido +
    "</td><td onclick='logText(this)'>" +
    persona.localidad.nombre +
    "</td><td onclick='logText(this)'>" +
    persona.sexo +
    "</td onclick='logText(this)'></tr>";
  var add = document.createElement("TR");
  add.innerHTML += row;
  document.getElementById("body").appendChild(add);
}

function fillSelect(localidad) {
  var option = document.createElement("option");
  var valor =
    "<option value=" + localidad.nombre + ">" + localidad.nombre + "</option>";
  option.innerHTML += valor;
  document.getElementById("localidades").appendChild(option);
}

xhttp2.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let respuesta = this.response;
    let vector = JSON.parse(respuesta);
    vector.forEach((Element) => {
      fillSelect(Element);
    });
  }
};
xhttp2.open("GET", "http://localhost:3000/localidades", true);
xhttp2.send();

function loader() {
  var loader = document.getElementById("container");
  var table = document.getElementById("containerTable");
  setTimeout(function () {
    loader.style.cssText = "visibility : hidden;";
  }, 3000);
  table.style.cssText = "visibility : initial;";
}

function validName(Name) {
  if (Name.length > 3) {
    return true;
  } else {
    return false;
  }
}

function validDate(date) {
  var dateLess = 24 * 60 * 60 * 1000 * 2;
  if (new Date(date).getTime() < new Date().getTime() - dateLess) {
    return true;
  } else {
    return false;
  }
}

function getId(nombre, apellido, localidad, sexo) {
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let respuesta = this.response;
      let vector = JSON.parse(respuesta);
      vector.forEach((Element) => {
        if (Element.nombre == nombre || Element.apellido == apellido) {
          requestEditContact(Element.id, nombre, apellido, localidad, sexo);
        }
      });
    }
  };
  xhttp.open("GET", "http://localhost:3000/personas", true);
  xhttp.send();
}

function requestEditContact(id, nombre, apellido, localidad, sexo) {
  var loc;
  xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let respuesta = this.response;
      let vector = JSON.parse(respuesta);
      vector.forEach((Element) => {
        if (Element.nombre == localidad) {
          xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              var spinner = document.getElementById("spinner");
              spinner.style.cssText = "visibility : hidden;";
            } else {
              console.log("No");
            }
          };
          xhttp.open("POST", "http://localhost:3000/editar", true);
          xhttp.setRequestHeader("content-type", "application/json");
          let Persona = {
            id: id,
            nombre: nombre,
            apellido: apellido,
            localidad: { id: Element.id , nombre: Element.nombre},
            sexo: sexo,
          };
          xhttp.send(JSON.stringify(Persona));
        };
      });
    }
  };
  xhttp2.open("GET", "http://localhost:3000/localidades", true);
  xhttp2.send();
}

function editContactCall() {
  var nombre = document.getElementById("name").value;
  var apellido = document.getElementById("lastname").value;
  var localidad = document.getElementById("localidades").value;
  var sexo;
  if (MaleCB.checked) {
    sexo = "Masculino";
  } else {
    sexo = "Femenino";
  }
  if (sexo != null) {
    if (validName(nombre) && validName(apellido)) {
      var spinner = document.getElementById("spinner");
      spinner.style.cssText = "visibility : initial;";
      getId(nombre, apellido, localidad, sexo);
    } else {
      console.log("No");
    }
  }
}