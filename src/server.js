const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API CRUD com Express e MySQL' });
});

app.get('/produtos', async (req, res) => {
  try {
    const [produtos] = await db.query('SELECT * FROM produtos ORDER BY id DESC');
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos' });
  }
});

app.get('/produtos/busca/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const [produtos] = await db.query(
      'SELECT * FROM produtos WHERE nome LIKE ?',
      [`%${nome}%`]
    );

    if (produtos.length === 0) {
      return res.status(404).json({ message: 'Nenhum produto encontrado' });
    }

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

app.get('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [produtos] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);

    if (produtos.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(produtos[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;

    if (!nome || preco === undefined || preco === null || preco === '') {
      return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
    }

    if (Number(preco) <= 0) {
      return res.status(400).json({ message: 'O preço deve ser maior que zero' });
    }

    const [resultado] = await db.query(
      'INSERT INTO produtos (nome, preco, descricao) VALUES (?, ?, ?)',
      [nome, preco, descricao || null]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      preco,
      descricao: descricao || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
});

app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;

    if (!nome || preco === undefined || preco === null || preco === '') {
      return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
    }

    if (Number(preco) <= 0) {
      return res.status(400).json({ message: 'O preço deve ser maior que zero' });
    }

    const [resultado] = await db.query(
      'UPDATE produtos SET nome = ?, preco = ?, descricao = ? WHERE id = ?',
      [nome, preco, descricao || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ id, nome, preco, descricao: descricao || null });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover produto' });
  }
});

app.get('/categorias', async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM categorias ORDER BY id');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar categorias' });
  }
});

app.get('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [categorias] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);

    if (categorias.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json(categorias[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categoria' });
  }
});

app.post('/categorias', async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    const [resultado] = await db.query(
      'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
      [nome, descricao || null]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      descricao: descricao || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
});

app.put('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    const [resultado] = await db.query(
      'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
      [nome, descricao || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json({ id, nome, descricao: descricao || null });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar categoria' });
  }
});

app.delete('/categorias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover categoria' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
