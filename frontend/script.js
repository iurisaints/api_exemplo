// Endereço da API que nós mesmos criamos
const API_URL = 'http://localhost:3000';

const formulario = document.getElementById('formulario-produto');
const campoId = document.getElementById('produto-id');
const campoNome = document.getElementById('nome');
const campoPreco = document.getElementById('preco');
const campoDescricao = document.getElementById('descricao');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const botaoAtualizar = document.getElementById('botao-atualizar');
const textoModo = document.getElementById('texto-modo');
const mensagem = document.getElementById('mensagem');
const listaProdutos = document.getElementById('lista-produtos');
const tituloFormulario = document.getElementById('titulo-formulario');

function mostrarMensagem(texto, tipo = 'info') {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function limparMensagem() {
  mensagem.textContent = '';
  mensagem.className = 'mensagem';
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function entrarModoCriacao() {
  campoId.value = '';
  formulario.reset();
  tituloFormulario.textContent = 'Novo produto';
  textoModo.innerHTML =
    'Preencha o formulário e clique em salvar para enviar um <code>POST /produtos</code>.';
  botaoSalvar.textContent = 'Salvar produto';
  botaoCancelar.classList.add('oculto');
}

function entrarModoEdicao(produto) {
  campoId.value = produto.id;
  campoNome.value = produto.nome;
  campoPreco.value = produto.preco;
  campoDescricao.value = produto.descricao || '';
  tituloFormulario.textContent = 'Editar produto';
  textoModo.innerHTML = `Alterando o produto <strong>#${produto.id}</strong> com <code>PUT /produtos/${produto.id}</code>.`;
  botaoSalvar.textContent = 'Atualizar produto';
  botaoCancelar.classList.remove('oculto');
  campoNome.focus();
}

function criarCardProduto(produto) {
  const card = document.createElement('article');
  card.classList.add('card-produto');

  const topo = document.createElement('div');
  topo.classList.add('card-topo');

  const nome = document.createElement('h3');
  nome.textContent = produto.nome;

  const preco = document.createElement('p');
  preco.classList.add('preco');
  preco.textContent = formatarPreco(produto.preco);

  topo.appendChild(nome);
  topo.appendChild(preco);
  card.appendChild(topo);

  if (produto.descricao) {
    const descricao = document.createElement('p');
    descricao.classList.add('descricao');
    descricao.textContent = produto.descricao;
    card.appendChild(descricao);
  }

  const meta = document.createElement('p');
  meta.classList.add('meta');
  meta.textContent = `ID: ${produto.id}`;
  card.appendChild(meta);

  const acoes = document.createElement('div');
  acoes.classList.add('acoes-card');

  const botaoEditar = document.createElement('button');
  botaoEditar.type = 'button';
  botaoEditar.classList.add('secundario');
  botaoEditar.textContent = 'Editar';
  botaoEditar.addEventListener('click', () => entrarModoEdicao(produto));

  const botaoRemover = document.createElement('button');
  botaoRemover.type = 'button';
  botaoRemover.classList.add('perigo');
  botaoRemover.textContent = 'Excluir';
  botaoRemover.addEventListener('click', () => removerProduto(produto.id));

  acoes.appendChild(botaoEditar);
  acoes.appendChild(botaoRemover);
  card.appendChild(acoes);

  return card;
}

async function listarProdutos() {
  try {
    mostrarMensagem('Carregando produtos...', 'info');
    listaProdutos.innerHTML = '';

    const resposta = await fetch(`${API_URL}/produtos`);

    if (!resposta.ok) {
      throw new Error('Não foi possível listar os produtos.');
    }

    const produtos = await resposta.json();
    console.log('GET /produtos →', produtos);

    if (produtos.length === 0) {
      const vazio = document.createElement('p');
      vazio.classList.add('vazio');
      vazio.textContent = 'Nenhum produto cadastrado ainda.';
      listaProdutos.appendChild(vazio);
      mostrarMensagem('Lista carregada: 0 produtos.', 'sucesso');
      return;
    }

    for (const produto of produtos) {
      listaProdutos.appendChild(criarCardProduto(produto));
    }

    mostrarMensagem(`Lista carregada: ${produtos.length} produto(s).`, 'sucesso');
  } catch (error) {
    console.error(error);
    mostrarMensagem(
      'Erro ao listar produtos. A API está rodando em http://localhost:3000?',
      'erro'
    );
  }
}

async function salvarProduto(evento) {
  evento.preventDefault();
  limparMensagem();

  const id = campoId.value;
  const dados = {
    nome: campoNome.value.trim(),
    preco: Number(campoPreco.value),
    descricao: campoDescricao.value.trim() || null,
  };

  const editando = Boolean(id);
  const url = editando ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`;
  const metodo = editando ? 'PUT' : 'POST';

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json().catch(() => ({}));
    console.log(`${metodo} ${url} →`, resultado);

    if (!resposta.ok) {
      throw new Error(resultado.message || 'Erro ao salvar produto.');
    }

    entrarModoCriacao();
    await listarProdutos();
    mostrarMensagem(
      editando ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!',
      'sucesso'
    );
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message || 'Erro ao salvar produto.', 'erro');
  }
}

async function removerProduto(id) {
  const confirmou = window.confirm(`Tem certeza que deseja excluir o produto #${id}?`);

  if (!confirmou) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/produtos/${id}`, {
      method: 'DELETE',
    });

    console.log(`DELETE /produtos/${id} → status`, resposta.status);

    if (!resposta.ok && resposta.status !== 204) {
      const resultado = await resposta.json().catch(() => ({}));
      throw new Error(resultado.message || 'Erro ao remover produto.');
    }

    if (campoId.value === String(id)) {
      entrarModoCriacao();
    }

    await listarProdutos();
    mostrarMensagem('Produto removido com sucesso!', 'sucesso');
  } catch (error) {
    console.error(error);
    mostrarMensagem(error.message || 'Erro ao remover produto.', 'erro');
  }
}

formulario.addEventListener('submit', salvarProduto);
botaoCancelar.addEventListener('click', () => {
  entrarModoCriacao();
  limparMensagem();
});
botaoAtualizar.addEventListener('click', listarProdutos);

// Ao abrir a página, já buscamos a lista
listarProdutos();
