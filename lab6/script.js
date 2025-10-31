if(!localStorage.getItem("produtos-selecionados")){
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados'));

let cestoContainer = document.querySelector("#cesto");


function criarProduto(produto) {

  const novoProduto = document.createElement('article');

  novoProduto.innerHTML = `<h3>${produto.title}</h3>
      <img src="${produto.image}" alt="${produto.title}">
      <p>Custo total: ${produto.price.toFixed(2)} €</p>
      <button class="botaoAdicionar" data-index="${produto.id}"> + Adicionar ao Cesto</button>`;

  const botaoAdicionar = novoProduto.querySelector('.botaoAdicionar');

  botaoAdicionar.addEventListener('click', function() {

    produtosSelecionados.push(produto);

    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));

    atualizaCesto();

  });

  return novoProduto;
}

function carregarProdutos(produtos) {
  const produtosContainer = document.querySelector("#produtos");

  produtosContainer.innerHTML = "";

  produtos.forEach((produto, index) => {

    const novoProduto = criarProduto(produto);

    produtosContainer.appendChild(novoProduto);
  });
}


function atualizaCesto(){

  produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));

  cestoContainer = document.querySelector("#cesto");

  cestoContainer.innerHTML = "";

  // Reseta o preço total antes de recalcular
  let precoTotal = 0;

  if(produtosSelecionados.length > 0) {

    produtosSelecionados.forEach((produto) => {

      const itemCesto = criaProdutoCesto(produto);
      cestoContainer.appendChild(itemCesto);
      precoTotal += produto.price;
    })

    console.log(`O preço total é: ${precoTotal.toFixed(2)} €`);
  }

  // Atualiza o elemento HTML com o preço total
  const totalElement = document.querySelector('.custo-final');
  if(totalElement) {
    totalElement.innerHTML = `<h3>Preço Total: ${precoTotal.toFixed(2)} €</h3>`;
  }

}

function criaProdutoCesto(produto){

  const novoProduto = document.createElement('article');

  novoProduto.innerHTML = `<h3>${produto.title}</h3>
      <img src="${produto.image}" alt="${produto.title}">
      <p>Custo total: ${produto.price.toFixed(2)} €</p>
      <button class="botaoRemover" data-index="${produto.id}"> - Remover do Cesto</button>`;

  const botaoRemover = novoProduto.querySelector('.botaoRemover');

  botaoRemover.addEventListener('click', function() {

    // Encontra o índice do produto no array usando indexOf
    const indexParaRemover = produtosSelecionados.indexOf(produto);

    if(indexParaRemover !== -1) {
      produtosSelecionados.splice(indexParaRemover, 1);

      localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));

      atualizaCesto();
    }

  });

  return novoProduto;

}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos(produtos);
  atualizaCesto(); // Carrega o cesto ao iniciar
});