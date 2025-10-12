const titulo = document.getElementById('passar-rato');
const corDeFundo = document.querySelector('body');
const textoCor = document.querySelector('.cortexto');
const btnCorVermelho = document.querySelector('.vermelho');
const btnCorVerde = document.querySelector('.verde');
const btnCorAzul = document.querySelector('.azul');
const corInput = document.querySelector('.inputcor');
const corEmIngles = document.querySelector('.corEng');
const botaoSubmeter = document.querySelector('.btnSubmeter');
const counterElement = document.querySelector('#counter');
const corTexto2 = document.querySelector(".cortxt2");
const nomeInput = document.querySelector('#nome');
const idadeInput = document.querySelector('#idade');
const msg = document.querySelector('.msgForm');

let counter2 = 0;
let counter = localStorage.getItem('counter') || 33;

const cores = ["lightblue", "lightgreen", "lightpink", "lightyellow", "lavender", "lightcoral"];
let indice = 0;

titulo.addEventListener("mouseover", () => {
  titulo.textContent = "1. Obrigado por passares";
});

titulo.addEventListener("mouseout", () => {
  titulo.textContent = "1. Passa por aqui!";
});

btnCorVermelho.addEventListener("click", () => {
  textoCor.style.color = "red";
});

btnCorVerde.addEventListener("click", () => {
  textoCor.style.color = "green";
});

btnCorAzul.addEventListener("click", () => {
  textoCor.style.color = "blue";
});

corInput.addEventListener("input", () => {
  corInput.style.backgroundColor = cores[indice];
  indice++;

  if (indice >= cores.length) {
    indice = 0;
  }
});

botaoSubmeter.addEventListener("click", () => {
  const corDigitada = corEmIngles.value.trim(); 
  corDeFundo.style.backgroundColor = corDigitada;
});

  document.querySelectorAll("button.color").forEach((button) => {
    button.addEventListener("click", () => {
      corTexto2.style.color = button.dataset.color;
    });
  });


document.querySelector('select').onchange = function() {
    document.querySelector('body').style.backgroundColor = this.value;
}

document.querySelector('form').onsubmit = (e) => {
  e.preventDefault();

const nome = nomeInput.value;
const idade = idadeInput.value;

  msg.textContent = `Olá, o ${nome} tem ${idade}!`;
};


if(!localStorage.getItem('counter')){
  localStorage.setItem('counter', 33);
}

function count() {
  
    counter++;
    document.querySelector('#counter').textContent = counter;
    localStorage.setItem('counter', counter);
}
document.querySelector('#btnAdicionar').addEventListener('click', count);

document.querySelector('#counter').textContent = localStorage.getItem('counter');

function count2() {
    
  document.querySelector('.counterAuto').textContent = counter2++;
}
setInterval(count2, 1000);