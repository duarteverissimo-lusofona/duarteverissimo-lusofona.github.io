// Variáveis globais
let produtos = [];
let categorias = [];
let produtosSelecionados = [];
let cestoContainer;

// Variáveis para filtros
let categoriaAtual = "";
let ordenacaoAtual = "";
let pesquisaAtual = "";

// Inicializa o localStorage se não existir
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

// Função para carregar categorias da API
async function carregarCategoriasDaAPI() {
  try {
    const response = await fetch('https://deisishop.pythonanywhere.com/categories/');
    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
    const data = await response.json();
    categorias = data;
    preencherSelectCategorias();
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

// Função para preencher o select de categorias
function preencherSelectCategorias() {
  const select = document.querySelector("#filtro-categoria");
  while (select.options.length > 1) select.remove(1);
  categorias.forEach(categoria => {
    const opcao = document.createElement('option');
    opcao.value = categoria;
    opcao.textContent = categoria;
    select.appendChild(opcao);
  });
}

// Função para carregar produtos da API
async function carregarProdutosDaAPI() {
  try {
    const response = await fetch('https://deisishop.pythonanywhere.com/products/');
    if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
    const data = await response.json();
    produtos = data;
    aplicarFiltros();
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    document.querySelector("#produtos").innerHTML = `<p style="color: red; padding: 20px;">Erro ao carregar produtos. Tente novamente.</p>`;
  }
}

// Função para aplicar todos os filtros
function aplicarFiltros() {
  let produtosFiltrados = [...produtos];
  if (categoriaAtual) produtosFiltrados = produtosFiltrados.filter(p => p.category === categoriaAtual);
  if (pesquisaAtual) produtosFiltrados = produtosFiltrados.filter(p => p.title.toLowerCase().includes(pesquisaAtual.toLowerCase()));
  if (ordenacaoAtual === "crescente") produtosFiltrados.sort((a, b) => a.price - b.price);
  else if (ordenacaoAtual === "decrescente") produtosFiltrados.sort((a, b) => b.price - a.price);
  carregarProdutos(produtosFiltrados);
}

// Configurar event listeners dos filtros
function configurarFiltros() {
  document.querySelector("#filtro-categoria").addEventListener('change', function() {
    categoriaAtual = this.value;
    aplicarFiltros();
  });
  document.querySelector("#ordenar-preco").addEventListener('change', function() {
    ordenacaoAtual = this.value;
    aplicarFiltros();
  });
  document.querySelector("#pesquisar-produto").addEventListener('input', function() {
    pesquisaAtual = this.value;
    aplicarFiltros();
  });
}

function criarProduto(produto) {
  const novoProduto = document.createElement('article');
  novoProduto.innerHTML = `
    <h3>${produto.title}</h3>
    <img src="${produto.image}" alt="${produto.title}">
    <p>${produto.description || ''}</p>
    <p><strong>Preço: ${produto.price.toFixed(2)} €</strong></p>
    <button class="botaoAdicionar">+ Adicionar ao Cesto</button>
  `;
  novoProduto.querySelector('.botaoAdicionar').addEventListener('click', function() {
    produtosSelecionados.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));
    atualizaCesto();
  });
  return novoProduto;
}

function carregarProdutos(listaProdutos) {
  const produtosContainer = document.querySelector("#produtos");
  produtosContainer.innerHTML = "";
  if (listaProdutos.length === 0) {
    produtosContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }
  listaProdutos.forEach(produto => produtosContainer.appendChild(criarProduto(produto)));
}

function atualizaCesto() {
  produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados"));
  cestoContainer = document.querySelector("#cesto");
  cestoContainer.innerHTML = "";
  let precoTotal = 0;

  if (produtosSelecionados.length > 0) {
    produtosSelecionados.forEach((produto, index) => {
      cestoContainer.appendChild(criaProdutoCesto(produto, index));
      precoTotal += produto.price;
    });
  } else {
    cestoContainer.innerHTML = "<p>O cesto está vazio.</p>";
  }

  document.querySelector('.custo-final').innerHTML = `<h3>Preço Total: ${precoTotal.toFixed(2)} €</h3>`;
  document.querySelector('#resultado-compra').innerHTML = "";
}

function criaProdutoCesto(produto, index) {
  const novoProduto = document.createElement('article');
  novoProduto.innerHTML = `
    <h3>${produto.title}</h3>
    <img src="${produto.image}" alt="${produto.title}">
    <p><strong>Preço: ${produto.price.toFixed(2)} €</strong></p>
    <button class="botaoRemover">- Remover do Cesto</button>
  `;
  novoProduto.querySelector('.botaoRemover').addEventListener('click', function() {
    produtosSelecionados.splice(index, 1);
    localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados));
    atualizaCesto();
  });
  return novoProduto;
}


async function processarCompra() {
  const produtosNoCesto = JSON.parse(localStorage.getItem("produtos-selecionados"));
  const resultadoCompraDiv = document.querySelector('#resultado-compra');

  if (produtosNoCesto.length === 0) {
    resultadoCompraDiv.innerHTML = `<p class="erro">O cesto está vazio.</p>`;
    return;
  }

  const ehEstudante = document.querySelector("#checkbox-estudante").checked;

  const dadosParaAPI = {
    products: produtosNoCesto.map(p => p.id),
    student: ehEstudante,
    name: "Maria Lisboa",
    coupon: "black-friday"
  };

  resultadoCompraDiv.innerHTML = `<p class="info">A processar...</p>`;

  try {
    const response = await fetch('https://deisishop.pythonanywhere.com/buy/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosParaAPI)
    });

    const data = await response.json();

    if (response.ok) {
      let resultadoHTML = '';

      if (ehEstudante) {
        // Se for estudante, usa o preço com desconto da API
        resultadoHTML = `
          <div class="sucesso">
            <p><strong>Valor final a pagar:</strong> ${data.totalCost} €</p>
            <p><strong>Referência de pagamento:</strong> ${data.reference}</p>
          </div>
        `;
      } else {
        // Se não for estudante, calcula o preço local mas usa a referência da API
        const precoTotal = produtosNoCesto.reduce((soma, produto) => soma + produto.price, 0);
        resultadoHTML = `
          <div class="sucesso">
            <p><strong>Valor final a pagar:</strong> ${precoTotal.toFixed(2)} €</p>
            <p><strong>Referência de pagamento:</strong> ${data.reference}</p>
          </div>
        `;
      }
      resultadoCompraDiv.innerHTML = resultadoHTML;
    } else {
      // Se a API der um erro
      resultadoCompraDiv.innerHTML = `<p class="erro">Erro: ${data.error || 'Não foi possível processar o pedido.'}</p>`;
    }
  } catch (error) {
    // Se houver um erro de conexão
    console.error('Erro de conexão:', error);
    resultadoCompraDiv.innerHTML = `<p class="erro">Erro de conexão. Verifique a sua internet.</p>`;
  }
}

// Event listener para quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  configurarFiltros();
  document.querySelector("#botao-comprar").addEventListener('click', processarCompra);
  carregarCategoriasDaAPI();
  carregarProdutosDaAPI();
  atualizaCesto();
});