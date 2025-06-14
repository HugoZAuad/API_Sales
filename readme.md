# My Sales

Bem-vindo ao **My Sales**!  
Este é um sistema feito para ajudar a controlar vendas, clientes, produtos, usuários e pedidos. Ele foi criado usando várias ferramentas modernas e boas práticas de programação para garantir que tudo funcione direitinho, de forma segura e organizada.

---

## O que é esse projeto?

Imagine uma loja onde você precisa saber:
- Quem são seus clientes
- Quais produtos você tem
- Quem são os vendedores (usuários)
- Quais pedidos foram feitos

O **My Sales** faz tudo isso! Ele é uma API, ou seja, um programa que recebe pedidos (requisições) e responde com informações, tudo pela internet.

---

## Tecnologias Utilizadas

- **Node.js**: É como o cérebro do projeto, faz tudo funcionar.
- **TypeScript**: Ajuda a evitar erros, mostrando quando algo está errado antes mesmo de rodar o programa.
- **Express**: É quem recebe e responde os pedidos (requisições) da internet.
- **TypeORM**: Cuida do banco de dados, guardando e buscando informações.
- **PostgreSQL**: É o lugar onde os dados ficam guardados.
- **Redis**: Ajuda a deixar tudo mais rápido, guardando informações temporárias.
- **Jest**: Testa se tudo está funcionando como deveria.
- **Multer**: Ajuda a salvar arquivos, como fotos de perfil.
- **Celebrate/Joi**: Confere se os dados enviados estão certinhos.
- **bcrypt**: Deixa as senhas seguras, embaralhando elas.
- **JWT (jsonwebtoken)**: Gera um cartão de acesso (token) para quem faz login.
- **Nodemailer**: Envia e-mails, por exemplo, para recuperar senha.

---

## Como está organizado?

```
my_sales/
│
├── src/
│   ├── config/         # Configurações, como envio de email e upload de arquivos
│   ├── modules/        # Cada parte do sistema (usuários, produtos, clientes, pedidos)
│   │   ├── users/
│   │   ├── products/
│   │   ├── customers/
│   │   └── orders/
│   ├── shared/         # Coisas usadas por todo o sistema (erros, middlewares, cache, etc)
│   └── @types/         # Tipos personalizados do TypeScript
│
├── tests/              # Testes automáticos para garantir que tudo funciona
├── uploads/            # Onde ficam os arquivos enviados (ex: fotos de perfil)
├── .env                # Segredos e configurações (não compartilhe!)
├── package.json        # Lista de dependências e scripts
└── README.md           # Este arquivo!
```

---

## O que cada parte faz?

### 1. **Usuários**
- Cadastro, login, atualização de perfil e troca de senha.
- Senhas são protegidas com bcrypt.
- Só quem está logado pode acessar certas partes (usando JWT).
- Pode enviar foto de perfil.

### 2. **Produtos**
- Cadastro, listagem, atualização e remoção de produtos.
- Não deixa cadastrar produtos com o mesmo nome ou dados errados.

### 3. **Clientes**
- Cadastro, listagem, atualização e remoção de clientes.
- Valida se o e-mail é válido e único.

### 4. **Pedidos**
- Criação de pedidos, associando clientes e produtos.
- Verifica se o cliente e os produtos existem e se tem quantidade suficiente.

### 5. **Middlewares**
- **Autenticação**: Só deixa entrar quem tem token válido.
- **Tratamento de erros**: Responde com mensagens amigáveis quando algo dá errado.
- **Rate Limiter**: Impede que alguém faça muitos pedidos em pouco tempo (protege contra ataques).

### 6. **Validação**
- Usa Celebrate/Joi para garantir que os dados enviados estão corretos (ex: e-mail válido, senha forte).

### 7. **Cache**
- Usa Redis para guardar listas temporariamente e deixar tudo mais rápido.

### 8. **Testes**
- Usa Jest para testar cada parte do sistema, garantindo que tudo funciona e continua funcionando mesmo depois de mudanças.

---

## Boas Práticas Aplicadas

- **Separação de responsabilidades**: Cada arquivo faz só uma coisa.
- **Validação de dados**: Antes de salvar ou buscar algo, confere se está tudo certo.
- **Senhas seguras**: Nunca salva senha sem proteção.
- **Tratamento de erros**: Sempre responde com mensagens claras.
- **Testes automatizados**: Garante que tudo funciona, mesmo depois de mudanças.
- **Variáveis de ambiente**: Segredos (como senhas do banco) ficam fora do código.
- **Padronização de código**: Usa ESLint e Prettier para manter tudo organizado e bonito.
- **Arquitetura modular**: Cada módulo (usuário, produto, etc) é independente.

---

## Como rodar o projeto?

1. **Clone o repositório**
   ```sh
   git clone https://github.com/seu-usuario/my_sales.git
   cd my_sales
   ```

2. **Instale as dependências**
   ```sh
   npm install
   ```

3. **Configure o banco de dados e variáveis de ambiente**
   - Copie `.env.example` para `.env` e preencha com seus dados.

4. **Rode as migrações para criar as tabelas**
   ```sh
   npm run typeorm migration:run
   ```

5. **Inicie o servidor**
   ```sh
   npm run dev
   ```
   O servidor vai rodar em `http://localhost:3333`

6. **Rode os testes**
   ```sh
   npm test
   ```

---

## Exemplos de uso

- **Cadastrar usuário:**  
  Envie um POST para `/users/` com nome, email e senha.
- **Fazer login:**  
  Envie um POST para `/sessions` com email e senha. Vai receber um token.
- **Cadastrar produto:**  
  Envie um POST para `/products` com nome, preço e quantidade (precisa estar logado).
- **Criar pedido:**  
  Envie um POST para `/orders` com o id do cliente e os produtos (precisa estar logado).

---

## Dicas para quem está começando

- Sempre leia as mensagens de erro, elas ajudam a entender o que está errado.
- Não compartilhe o arquivo `.env` com ninguém!
- Antes de rodar, confira se o banco de dados está funcionando.
- Use os testes para garantir que não quebrou nada sem querer.

---

## Conclusão

Este projeto foi feito pensando em segurança, organização e facilidade de uso.  
Se você tiver dúvidas, pode olhar o código, pois ele está separado em partes pequenas e fáceis de entender.  
Divirta-se programando e aprendendo!

---

> Feito com carinho para quem quer aprender e vender mais! 🚀

---

Se quiser saber mais sobre algum arquivo ou parte do projeto, é só perguntar!