const stateEl = document.querySelectorAll(".estado")

stateEl.forEach(state => {
  state.addEventListener("click", () =>{
    estado = state.children[state.children.length - 1].textContent;
    estado = estado.trim()
    buscaCidades(estado);
  })
})

const estadoLista = []

async function getCidades() {
  const response = await fetch('../../estados.json')
  const data = await response.json();
  return data.estados
}

getCidades().then(estadoArray => {
  estadoArray.forEach(estado => {
    estadoLista.push(estado)
  })
})



function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

firebase.auth().onAuthStateChanged(user => {
    if (user){
        findTransactions(user);
    }
})

function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}

function findTransactions(user) {
    showLoading();
    localStorage.setItem('estado', document.getElementById("cidade").value);
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao recuperar transacoes');
        })
}

function findTransactionsMunicipio() {
    showLoading();
    
    localStorage.setItem('estado', document.getElementById("cidade").value);
    transactionService.findByUser(document.getElementById("cidade"))
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao recuperar transacoes');
        })
}


function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));
        li.appendChild(createImage(formatImage(transaction.image)))
        li.appendChild(createParagraph(formatDate(transaction.date)));
        li.appendChild(createParagraph(formatMoney(transaction.money)));
        li.appendChild(createParagraph(transaction.type));
        if (transaction.description) {
            li.appendChild(createParagraph(transaction.description));
        }

        orderedList.appendChild(li);
    });
}

function createTransactionListItem(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.type);
    li.id = transaction.uid;
    li.addEventListener('click', () => {
        window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
    })
    return li;
}

function createDeleteButton(transaction) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = "Remover";
    deleteButton.classList.add('outline', 'danger');
    deleteButton.addEventListener('click', event => {
        event.stopPropagation();
        askRemoveTransaction(transaction);
    })
    return deleteButton;
}

function createParagraph(value) {
    const element = document.createElement('p');
    element.innerHTML = value;
    return element;
}
function createImage(value) {
    if(value != ''){
        const element = document.createElement('img');
        element.src = value;
        return element;
    } else {
        const element = document.createElement('p');
        element.innerHTML = 'Sem Imagem!';
        return element;
    }
    
}

function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transaçao?');
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}

function removeTransaction(transaction) {
    showLoading();

    transactionService.remove(transaction)
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao remover transaçao');
        })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}

function formatImage(image){
    try{ url = `${image.url}`} 
    catch{ url = ''}
    return url
}

const form = {
    municipio: () => document.getElementById("cidade"),
};




function buscaCidades(e) {
  document.querySelector("#cidade").innerHTML = "";
  var cidade_select = document.querySelector("#cidade");

  var num_estados = estadoLista.length;
  var j_index = -1;

  // aqui eu pego o index do Estado dentro do JSON
  for (var x = 0; x < num_estados; x++) {
    if (estadoLista[x].sigla == e) {
      j_index = x;
    }
  }

  if (j_index != -1) {
    // aqui eu percorro todas as cidades e crio os OPTIONS
    estadoLista[j_index].cidades.forEach(function (cidade) {
      var cid_opts = document.createElement("option");
      cid_opts.setAttribute("value", cidade);
      cid_opts.innerHTML = cidade;
      cidade_select.appendChild(cid_opts);
    });
  } else {
    document.querySelector("#cidade").innerHTML = "";
  }
}


  