# Teste técnico IDS Software
Resolução do desafio fullstack do processo seletivo da IDS Software. Neste repositório está contido apenas o frontend, para entrar no backend acesse: https://github.com/edilson-nantes/nota-fiscal-api

<h1 align="center">
<br>
Desafio processo Seletivo IDS
</h1>

</h1>

## Tecnologias

As tecnologias utilizadas foram:

- **PrimeNG** — Biblioteca para criação de componentes de interface gráfica

- **Tailwind CSS** —  Framework de CSS para estilização e layout 

- **TypeScript** — Linguagem de programção usada para desenvolver a aplicação

- **Angular** — Framework JavaScript para construir interfaces de usuário

 ## Descrição
 O projeto se baseia em construir uma aplicação para a entrada de notas fiscais. Onde o frontend consiste em se comunicar com a API para fazer o gerenciamento de produtos, fornecedores e das notas fiscais.

- Products Page
- Suppliers Page
- Notas Page

 ## Requisitos

**PRODUCTS PAGE - MANAGE PRODUCTS** 
- Tabela para listar os produtos cadastrados.
- Link para cadastro de novos produtos.
- Seleção de produtos para ações em massa.
- Botão para deletar os produtos selecionados.
- Edição de produtos.
- Campo de busca de protudos.

**SUPPLIERS PAGE - MANAGE SUPPLIERS**
- Tabela para listar os fornecedores cadastrados.
- Link para cadastro de novos fornecedores.
- Seleção de fornecedores para ações em massa.
- Botão para deletar os fornecedores selecionados.
- Edição de fornecedores.
- Campo de busca de fornecedores.

**NOTAS PAGE - MANAGE NOTAS**
- Tabela para listar as notas fiscais cadastradas.
- Link para cadastro de novas notas.
- Seleção de notas para ações em massa.
- Botão para deletar as notas selecionadas.
- Edição de notas fiscais.
- No modo de edição é possível adicionar, editar e excluir os itens da nota fiscal.
- Campo de busca de notas.


##  Download e Teste



-  Instalar o [Git](https://git-scm.com/), [NodeJS](https://nodejs.org/pt-br/download/) + [npm](https://www.npmjs.com/get-npm) e ter configurado o [backend](https://github.com/edilson-nantes/task-manager-backend):

```bash
# Versões utilizadas no desenvolvimento.
 node -v
v22.14.0

 npm -v
10.9.2

 ng --version
19.2.0
```

```bash
# Clonar o repositório
 git clone https://github.com/edilson-nantes/nota-fiscal-frontend/

#Entrar no diretório
 cd nota-fiscal-frontend

#Verifique se o arquivo environment.ts dentro da pasta ./src/environments está com a baseURL da API backend configurado corretamente.

#Instalar as dependências
 npm install
```
- As credenciais do arquivo environment.ts podem ser alteradas de acordo com a necessidade, mas as credenciais usadas no desenvolvimento foram:

```bash
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080'
};
```

- Digite o seguinte comando para rodar a aplicação:
```bash
ng serve
```

- Por ultimo abra seu navegador e acesse:

```
http://localhost:4200/
```

---
