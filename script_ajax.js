const d = document;
const $table = d.querySelector(".crud-table");
const $form = d.querySelector(".crud-form");
const $title = d.querySelector(".crud-title");
const $template = d.getElementById("crud-template").content;
const $fragment = d.createDocumentFragment();

const ajax = (options) => {
  let {url, method, success, error, data } = options;
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", e => {
    if(xhr.readyState !== 4) return;

    if(xhr.status >= 200 && xhr.status < 300){
      let json = JSON.parse(xhr.responseText);
      success(json);

    } else {
      let message = xhr.statusText || "Ocurrió un error";
      error(`Error ${xhr.status}: ${message}`);
    }
  });

  xhr.open(method || "GET", url);

  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

  xhr.send(JSON.stringify(data));
}

const getAll = () => {
  ajax({
    url: "http://localhost:3000/caballeros",
    success: (res) => {
      res.forEach(el => {
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
    },
    error: (err) => {
      console.error(err);
      $table.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`);
    }
  })
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", e => {
  if (e.target === $form){
    e.preventDefault();

    if(!e.target.id.value){
      //CREATE - POST
      ajax({
        url: "http://localhost:3000/caballeros",
        method: "POST",
        success: () => location.reload(),
        error: () => $form.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`),
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value
        }
      });
    }  else {
      //UPDATE - PUT
      ajax({
        url: `http://localhost:3000/caballeros/${e.target.id.value}`,
        method: "PUT",
        success: () => location.reload(),
        error: () => $form.insertAdjacentHTML("afterend",`<p><b>${err}</b></p>`),
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value
        }
      });
    }
  }
});

d.addEventListener("click", e => {
  if(e.target.matches(".edit")){
    console.log("editar")
    $title.textContent = "Editar Caballero";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }

  if(e.target.matches(".delete")){
    let isDelete = confirm(`¿Estas seguro de eliminar ${e.target.dataset.id}?`)
    //DELETE - DELETE
    if(isDelete){
      ajax({
        url: `http://localhost:3000/caballeros/${e.target.dataset.id}`,
        method: "DELETE",
        success: () => location.reload(),
        error: () => alert(err)
      });
    }
  }
})