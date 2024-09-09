/* eslint-disable no-undef */
describe('Página de Login', () => {
  it('Deve carregar a página de Login', () => {
    cy.visit('http://localhost:5173/login'); // Acessa a página de login

    // Verifica se o título da página está visível
    cy.contains('Login').should('be.visible');
    // Verifica se o texto de instrução está visível
    cy.contains('Se você é um administrador ou apenas quer abrir um chamado, faça login no sistema para continuar').should('be.visible');
  });

  it('Deve permitir o login de um usuário existente', () => {
    cy.visit('http://localhost:5173/login'); // Acessa a página de login

    // Preenche o formulário de login
    cy.get('input[placeholder="E-mail"]').type('john.doe@example.com'); // Email inválido
    cy.get('input[placeholder="Senha"]').type('password123'); // Senha inválida
    cy.get('input[placeholder="Digite sua matrícula"]').type('1234567');// Substitua pela matrícula de teste válida

    // Submete o formulário
    cy.get('button[type="submit"]').click(); 
    
    // Verifica se a mensagem de sucesso aparece (ajuste conforme necessário)
    cy.contains('Mensagem de sucesso!').should('be.visible'); // Ajuste conforme necessário

    // Verifica se o usuário é redirecionado para a página inicial
    cy.url().should('include', '/');
  });

  it('Deve mostrar mensagem de erro em caso de falha no login', () => {
    cy.visit('http://localhost:5173/login'); // Acessa a página de login

    // Preenche o formulário com credenciais inválidas
    cy.get('input[placeholder="E-mail"]').type('john.doe@example.com'); // Email inválido
    cy.get('input[placeholder="Senha"]').type('password123'); // Senha inválida
    cy.get('input[placeholder="Digite sua matrícula"]').type('1234567'); // Matrícula inválida

    // Submete o formulário
    cy.get('button[type="submit"]').click(); 
    
    // Verifica se a mensagem de erro aparece
    cy.contains('Erro desconhecido').should('be.visible'); // Ajuste conforme a mensagem de erro real
  });
});
