const ul = document.getElementById("ul");
const buttonInvia = document.getElementById("submit");
const inputText = document.getElementById("inputText");
let lista = [];
const myKey = "chiave";

function loadList() {
  fetch("/todo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.todos);
    lista = data.todos;
    render();
  })
}
loadList();

function render() {
    let html = "";
    lista.forEach((e, id) => {
      let completo = e.completed ? "done" : "";
      html += `<li id='li_${e.id}' class='divs ${completo}'>
        ${e.inputValue}
        <button type='button' class='pulsantiConferma' id='bottoneC_${e.id}'>conferma</button>
        <button type='button' class='pulsantiElimina' id='bottoneE_${e.id}'>elimina</button>
        
  
      </li>`;
    });
    ul.innerHTML = html;
  
    document.querySelectorAll(".pulsantiElimina").forEach((buttonElimina) => {
      buttonElimina.onclick = () => {
        const id = buttonElimina.id.replace("bottoneE_", "");
        remove(id);
      };
    });
  
    document.querySelectorAll(".pulsantiConferma").forEach((buttonConferma) => {
      buttonConferma.onclick = () => {
        const id = buttonConferma.id.replace("bottoneC_", "");
        update(id);
      };
    });
  }




buttonInvia.onclick = () => {
  const data = {
    inputValue: inputText.value,
    completed: false,
  };

  fetch("/todo/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      lista.push(result.todo); 
      render();
      inputText.value = ""; 
    });
};




function update(id) {
  const todo = lista.find((item) => item.id === id);
  fetch("/todo/complete", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then(() => {
      if(!todo.completed){
      todo.completed = true;
      }else{
        todo.completed=false
      } 
      render();
    });
}

/*
function modify(todo) {
  fetch("/todo/modify", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then(() => {
     todo.inputValue= modifyText.value;
      render();
    });
}
    */

function remove(id) {
    fetch(`/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        lista = lista.filter((item) => item.id !== id);
        render();
      });
  }

render();