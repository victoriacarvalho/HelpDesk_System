/* eslint-disable no-undef */
describe('Home Page e Chamado Form Page', () => {
  it('Deve carregar a página inicial com o Hero', () => {
    cy.visit('http://localhost:5173'); // URL local da aplicação
    cy.contains('Bem vindo(a) ao Ticket+').should('be.visible'); // Verifica o texto
    cy.get('img').should('have.attr', 'src').should('include', 'logo.png'); // Verifica a imagem
  });

  it('Deve navegar para a página de abertura de chamado', () => {
    cy.visit('http://localhost:5173'); // Acessa a página inicial

    // Encontra o botão ou link "Abrir Chamado" e clica nele
    cy.contains('Abrir Chamado').click(); // Altere para o texto correto do link ou botão que leva à página

    // Verifica se a URL mudou para "/chamado"
    cy.url().should('include', '/chamado');

    // Verifica se o título da página está visível
    cy.contains('Abertura de chamado').should('be.visible');

    // Verifica se os campos do formulário estão visíveis
    cy.get('input[placeholder="Primeiro nome"]').should('be.visible');
    cy.get('input[placeholder="Último nome"]').should('be.visible');
    cy.get('input[placeholder="E-mail"]').should('be.visible');
    cy.get('input[placeholder="Celular"]').should('be.visible');
    cy.get('input[placeholder="Setor"]').should('be.visible');
    cy.get('input[placeholder="Título"]').should('be.visible');
    cy.get('textarea[placeholder="Descrição"]').should('be.visible');
  });

  it('Deve preencher e enviar o formulário de abertura de chamado', () => {
    cy.visit('http://localhost:5173/chamado'); // Acessa a página do formulário diretamente

    // Preenche o formulário
    cy.get('input[placeholder="Primeiro nome"]').type('Victoria');
    cy.get('input[placeholder="Último nome"]').type('Silva');
    cy.get('input[placeholder="E-mail"]').type('victoria@example.com');
    cy.get('input[placeholder="Celular"]').type('123456789');
    cy.get('input[placeholder="Setor"]').type('Desenvolvimento');
    cy.get('input[placeholder="Título"]').type('Problema com o sistema');
    cy.get('textarea[placeholder="Descrição"]').type('Descrição detalhada do problema.');

    // Submete o formulário
    cy.get('button').contains('Enviar').click(); 
    
    // Verifica se a mensagem de sucesso aparece
    cy.contains('Chamado enviado com sucesso!').should('be.visible');
  });

  it('Deve mostrar mensagem de erro ao falhar no envio', () => {
    cy.visit('http://localhost:5173/chamado'); // Acessa a página do formulário

    // Preenche o formulário
    cy.get('input[placeholder="Primeiro nome"]').type('Victoria');
    cy.get('input[placeholder="Último nome"]').type('Silva');
    cy.get('input[placeholder="Primeiro nome"]').type('Victoria');
    cy.get('input[placeholder="Último nome"]').type('Silva');
    cy.get('input[placeholder="E-mail"]').type('victoria@example.com');
    cy.get('input[placeholder="Celular"]').type('123456789');
    cy.get('input[placeholder="Setor"]').type('Desenvolvimento');
    cy.get('input[placeholder="Título"]').type('Problema com o sistema');
    cy.get('textarea[placeholder="Descrição"]').type('Descrição detalhada do problema.');

    // Mockando o envio para simular um erro
    cy.intercept('POST', 'http://localhost:4000/api/v1/chamado/post', {
      statusCode: 500,
      body: { message: 'Falha ao enviar chamado.' },
    });

    // Submete o formulário
    cy.get('button').contains('Enviar').click(); 

    // Verifica se a mensagem de erro aparece
    cy.contains('Falha ao enviar chamado.').should('be.visible');
  });
});
