const d = document;
const $table = d.querySelector(".crud-table");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $template = d.getElementById("crud-template").content;
const $fragment = d.createDocumentFragment();

const getAll = async() => {
  try{
    let res = await fetch("http://localhost:3000/caballeros");
    let json = await res.json();

    if(!res.ok) throw {status:res.status, statusText: res.statusText};

    console.log(json);

    json.forEach(el => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".constellation").textContent = el.constelacion;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.constellation = el.constelacion;
      $template.querySelector(".delete").dataset.id = el.id;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);


    });

    $table.querySelector("tbody").appendChild($fragment);

  } catch (error){
    let message = err.statusText || "Ocurrió un error";
    $table.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);

  }
}

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
  if(e.target === $form){
    e.preventDefault();

    if(!e.target.id.value){
      //CREATE - POST
      try {
        let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value
          })
        }

        let res = await fetch("http://localhost:3000/caballeros", options);
        let json = await res.json();
    
        if(!res.ok) throw {status: res.status, statusText: res.statusText};

        location.reload();
      } catch (error) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
      }

    } else {
      //UPDATE - PUT
      try {
        let options = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value
          })
        }

        let res = await fetch(`http://localhost:3000/caballeros/${e.target.id.value}`, options);
        let json = await res.json();

        if(!res.ok) throw {status: res.status, statusText: res.statusText};

        location.reload();
      } catch (error) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
      }
    }
  }
})

d.addEventListener("click", async e => {
  if(e.target.matches(".edit")){
    console.log("editar")
    $title.textContent = "Editar Caballero";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }

  if(e.target.matches(".delete")){
    let isDelete = confirm(`Estás seguro de eliminar el id ${e.target.dataset.id}`);

    if(isDelete){
      //DELETE - DELETE
      try {
        let options = {
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          }
        }

        let res = await fetch(`http://localhost:3000/caballeros/${e.target.dataset.id}`, options);
        let json = await res.json();

        if(!res.ok) throw {status: res.status, statusText: res.statusText};

        location.reload();
      } catch (error) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${error.status}: ${message}`);
      }
    }
  }
});


d

