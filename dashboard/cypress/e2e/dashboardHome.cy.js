/* eslint-disable no-undef */
// cypress/integration/dashboard.spec.js

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Simula a rota de login
    cy.intercept('POST', 'http://localhost:4000/api/v1/user/login', {
      statusCode: 200,
      body: {
        message: 'Login realizado com sucesso',
        user: {
          email: 'victoriaC@email.com',
          matricula: '7654321',
        },
        token: 'adminToken',
      },
    }).as('loginRequest');

    // Simula o carregamento inicial dos chamados
    cy.intercept('GET', 'http://localhost:4000/api/v1/chamado/getall', {
      statusCode: 200,
      body: {
        chamados: [
          {
            _id: '1',
            firstName: 'Maria',
            lastName: 'Silva',
            chamado_date: '2023-09-01',
            status: 'Aberto',
          },
          {
            _id: '2',
            firstName: 'João',
            lastName: 'Pereira',
            chamado_date: '2023-08-15',
            status: 'Encerrado',
          },
        ],
      },
    }).as('getAllChamados');

    // Simula a contagem de chamados
    cy.intercept('GET', 'http://localhost:4000/api/v1/chamado/count', {
      statusCode: 200,
      body: { count: 2 },
    }).as('countChamados');

    cy.visit('http://localhost:5174/login'); // Vai para a página de login

    // Preenche o formulário de login e envia
    cy.get('input[placeholder="E-mail"]').type('victoriaC@email.com');
    cy.get('input[placeholder="Senha"]').type('111111111');
    cy.get('input[placeholder="Matrícula"]').type('7654321');
    cy.get('button[type="submit"]').click();

    // Aguarda o login ser bem-sucedido
    cy.wait('@loginRequest');
  });

  it('Deve carregar o Dashboard corretamente após o login', () => {
    // Espera o carregamento dos chamados
    cy.wait('@getAllChamados');
    cy.wait('@countChamados');

    // Verifica se o Dashboard foi carregado
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Chamados Fechados').should('be.visible');
    cy.contains('Total de Chamados').should('be.visible');
    cy.contains('Chamados Abertos').should('be.visible');
  });

  it('Deve exibir chamados não encerrados corretamente', () => {
    // Verifica se os chamados abertos estão listados
    cy.contains('Maria Silva').should('be.visible');
    cy.contains('Aberto').should('be.visible');
  });

  it('Deve permitir alteração do status de um chamado', () => {
    // Simula a atualização de status do chamado
    cy.intercept('PUT', 'http://localhost:4000/api/v1/chamado/update/1', {
      statusCode: 200,
      body: { message: 'Status atualizado com sucesso' },
    }).as('updateChamadoStatus');

    // Abre o menu de status e muda o status
    cy.contains('Aberto').click();
    cy.contains('Pendente').click();

    // Verifica se a mensagem de sucesso foi exibida
    cy.contains('Status atualizado com sucesso').should('be.visible');
  });

  it('Deve realizar logout corretamente', () => {
    // Simula o logout
    cy.intercept('GET', 'http://localhost:4000/api/v1/user/logout/admin', {
      statusCode: 200,
      body: { message: 'Logout realizado com sucesso' },
    }).as('logoutRequest');

    cy.contains('Logout').click();

    // Verifica se a mensagem de logout foi exibida
    cy.contains('Logout realizado com sucesso').should('be.visible');
  });
});
