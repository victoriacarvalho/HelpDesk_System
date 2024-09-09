/* eslint-disable no-undef */
describe('Formulário de Mensagens', () => {
  it('Deve carregar a página de envio de mensagens', () => {
    cy.visit('http://localhost:5173/aboutUs'); // Altere a URL conforme necessário

    // Verifica se o título da página está visível
    cy.contains('Envie uma mensagem a um dos técnicos').should('be.visible');
  });

  it('Deve permitir o envio de uma mensagem', () => {
    cy.visit('http://localhost:5173/aboutUs'); // Altere a URL conforme necessário

    // Preenche o formulário
    cy.get('input[placeholder="Primeiro nome"]').type('John');
    cy.get('input[placeholder="Último nome"]').type('Doe');
    cy.get('input[placeholder="E-mail"]').type('john.doe@example.com');
    cy.get('input[placeholder="Celular"]').type('12345678900');
    cy.get('textarea[placeholder="Menssagem"]').type('Olá, preciso de ajuda.');

    // Submete o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a mensagem de sucesso aparece
    cy.contains('Mensagem enviada com sucesso!').should('be.visible'); // Ajuste conforme necessário

    // Verifica se os campos foram limpos após o envio
    cy.get('input[placeholder="Primeiro nome"]').should('have.value', '');
    cy.get('input[placeholder="Último nome"]').should('have.value', '');
    cy.get('input[placeholder="E-mail"]').should('have.value', '');
    cy.get('input[placeholder="Celular"]').should('have.value', '');
    cy.get('textarea[placeholder="Menssagem"]').should('have.value', '');
  });

  it('Deve mostrar mensagem de erro em caso de falha no envio', () => {
    cy.visit('http://localhost:5173/aboutUs'); // Altere a URL conforme necessário

    // Preenche o formulário com dados inválidos (ou omite campos, conforme a lógica do seu backend)
    cy.get('input[placeholder="E-mail"]').type('invalid-email'); // Email inválido

    // Submete o formulário
    cy.get('button[type="submit"]').click();

    // Verifica se a mensagem de erro aparece
    cy.contains('Erro ao enviar a mensagem').should('be.visible'); // Ajuste conforme necessário
  });
});
