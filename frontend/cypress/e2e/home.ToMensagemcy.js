/* eslint-disable no-undef */
describe('Home Page', () => {
  it('Deve carregar a página inicial com o Hero', () => {
    cy.visit('http://localhost:5173'); // URL local da aplicação
    cy.contains('Bem vindo(a) ao Ticket+').should('be.visible'); // Verifica o texto
    cy.get('img').should('have.attr', 'src').should('include', 'logo.png'); // Verifica a imagem
    
    // Remover o cy.click() porque não há um elemento associado
    // Se você quiser testar o clique em um botão ou link, faça como no teste abaixo
  });

  it('Deve permitir navegar para a página About Us e enviar uma mensagem', () => {
    cy.visit('http://localhost:5173'); // Acessa a página inicial

    // Encontra o botão ou link "Enviar Mensagem" e clica nele
    cy.contains('Enviar Mensagem').click(); 
    
    // Verifica se a URL mudou para "/aboutUs"
    cy.url().should('include', '/aboutUs');
    
    // Verifica se o texto da página "Ficou alguma informação?" está visível
    cy.contains('Ficou alguma informação?').should('be.visible');
    
    // Preenche o formulário
    cy.get('input[placeholder="Primeiro nome"]').type('John');
    cy.get('input[placeholder="Último nome"]').type('Doe');
    cy.get('input[placeholder="E-mail"]').type('john.doe@example.com');
    cy.get('input[placeholder="Celular"]').type('12345678909');
    cy.get('textarea[placeholder="Menssagem"]').type('Esta é uma mensagem de teste.');

    // Submete o formulário
    cy.get('button[type="submit"]').click(); 
    
    // Verifica se a mensagem de sucesso aparece
    cy.contains('Mensagem enviada com sucesso!').should('be.visible');
  });
});
