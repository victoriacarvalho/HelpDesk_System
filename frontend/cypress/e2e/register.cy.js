/* eslint-disable no-undef */
describe('Página de Registro e Chamado', () => {
  it('Deve carregar a página de registro', () => {
    cy.visit('http://localhost:5173/register'); // URL da página de registro

    // Verifica se o título da página está visível
    cy.contains('Registre-se').should('be.visible');
    // Verifica se o texto de instrução está visível
    cy.contains('Cadastre-se em nosso sistema HelpDesk aproveite nossas funcionalidades!').should('be.visible');
  });

  it('Deve permitir o registro de um novo usuário', () => {
    cy.visit('http://localhost:5173/register'); // Acessa a página de registro

    // Preenche o formulário
    cy.get('input[placeholder="Primeiro nome"]').type('John');
    cy.get('input[placeholder="Último nome"]').type('Doe');
    cy.get('input[placeholder="E-mail"]').type('john.doe@example.com');
    cy.get('input[placeholder="Celular"]').type('12345678909');
    cy.get('input[placeholder="Setor"]').type('Desenvolvimento');
    cy.get('input[placeholder="Número de matrícula"]').type('1234567');
    cy.get('input[placeholder="Senha"]').type('password123');

    // Submete o formulário
    cy.get('button[type="submit"]').click(); 
    
    // Verifica se a mensagem de sucesso aparece (ajuste conforme necessário)
    cy.contains('Mensagem de sucesso!').should('be.visible'); // Supondo que a mensagem de sucesso aparece

    // Verifica se o usuário é redirecionado para a página inicial
    cy.url().should('include', '/');
  });

  it('Deve carregar a página de Chamado', () => {
    // Navega para a página de Chamado após o registro
    cy.visit('http://localhost:5173/chamado'); // URL da página de chamado

    // Verifica se a página de chamado carrega corretamente
    cy.contains('Título do Chamado').should('be.visible'); // Ajuste o texto conforme necessário
  });

  it('Deve permitir criar um novo chamado', () => {
    cy.visit('http://localhost:5173/chamado'); // Acessa a página de chamado

    // Preenche o formulário de chamado (ajuste os placeholders e valores conforme necessário)
    cy.get('input[placeholder="Título"]').type('Problema com o sistema');
    cy.get('textarea[placeholder="Descrição"]').type('Estou enfrentando um problema ao acessar a aplicação.');

    // Submete o formulário
    cy.get('button[type="submit"]').click(); 
    
    // Verifica se a mensagem de sucesso aparece (ajuste conforme necessário)
    cy.contains('Chamado criado com sucesso!').should('be.visible'); // Ajuste a mensagem conforme necessário

    // Verifica se o usuário é redirecionado ou se o chamado aparece na lista
    cy.url().should('include', '/'); // Ajuste se necessário
  });
});
