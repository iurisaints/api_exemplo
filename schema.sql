CREATE DATABASE IF NOT EXISTS primeira_api;

USE primeira_api;

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO produtos (nome, preco, descricao)
VALUES ('Teclado mecânico', 250.00, 'Teclado com switches azuis');
