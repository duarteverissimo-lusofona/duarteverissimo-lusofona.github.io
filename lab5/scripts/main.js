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
let counter = 0;

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

function count() {
    counter++;
    counterElement.textContent = 33 + counter;
}

document.querySelector('#btnAdicionar').addEventListener('click', count);

