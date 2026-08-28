USE primeira_api;

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categorias (nome, descricao) VALUES
  ('Periféricos', 'Produtos para computadores'),
  ('Hardware', 'Peças internas do computador'),
  ('Acessórios', 'Itens complementares');
