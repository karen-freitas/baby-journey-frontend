# Baby Journey Frontend

Bem-vindo ao repositório do **Baby Journey**, uma aplicação web desenvolvida para registrar e organizar memórias e marcos importantes do crescimento infantil. Este projeto foi criado como parte avaliativa do curso de pós-graduação em Desenvolvimento Full Stack da PUCRS.

---

## 📋 Descrição do Projeto

O **Baby Journey** foi idealizado para resolver a dificuldade enfrentada por pais e responsáveis em documentar momentos especiais de seus bebês de forma centralizada e segura. A aplicação permite o registro de memórias com fotos, descrições e datas, além de marcos de desenvolvimento infantil. Com uma interface responsiva e funcionalidades práticas, o projeto busca facilitar o acesso e a preservação dessas informações.

---

## 🚀 Funcionalidades

- **Cadastro e Login**: Autenticação segura com JWT.
- **Registro de Memórias**: Adicione fotos, descrições e datas de momentos especiais.
- **Marcos de Desenvolvimento**: Registre conquistas importantes do bebê.
- **Edição e Exclusão**: Atualize ou remova registros existentes.
- **Visualização em Carrossel**: Navegue pelas memórias de forma interativa.
- **Lista Vertical de Marcos**: Exiba marcos organizados com imagens e descrições.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React**: Framework para construção de interfaces.
- **Material-UI**: Biblioteca de componentes para estilização.
- **Context API**: Gerenciamento de estado global.
- **Axios**: Comunicação com a API.

### **Backend**
- **Node.js** e **NestJS**: Frameworks para construção da API.
- **MongoDB**: Banco de dados para armazenamento de registros.
- **JWT**: Autenticação segura.

---

## 🌐 Publicação

A aplicação está publicada e disponível para acesso nos seguintes endereços:

- **Frontend**: [https://baby-journey-frontend.vercel.app](https://baby-journey-frontend.vercel.app)
- **Backend (Repositório)**: [https://github.com/karen-freitas/baby-journey-api.git](https://github.com/karen-freitas/baby-journey-api.git)
- **Documentação da API**: [https://baby-journey-api.onrender.com/api-docs](https://baby-journey-api.onrender.com/api-docs)

---

## 🚧 Como Executar o Projeto

Para executar o projeto em sua máquina, siga os passos abaixo:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/karen-freitas/baby-journey-frontend
   ```
2. **Instale as dependências do backend**:
   ```bash
   cd baby-journey/backend
   npm install
   ```
3. **Configure o banco de dados**:
   - Crie um banco de dados MongoDB.
   - Adicione as credenciais no arquivo `.env`.
4. **Inicie o servidor do backend**:
   ```bash
   npm run start
   ```
5. **Instale as dependências do frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
6. **Inicie o servidor do frontend**:
   ```bash
   npm run start
   ```
7. **Acesse a aplicação**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

---