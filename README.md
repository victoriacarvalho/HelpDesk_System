# 💻 HelpDesk System

![Badge em Finalizado](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

O **HelpDesk System** é uma solução completa para gerenciamento de chamados e suporte técnico. O projeto foi desenvolvido utilizando a stack MERN (MongoDB, Express, React, Node.js) e está estruturado como um monorepo contendo três aplicações principais:

1.  **Backend:** API RESTful robusta para gerenciar dados, autenticação e regras de negócio.
2.  **Frontend:** Interface amigável para usuários finais abrirem e acompanharem seus chamados.
3.  **Dashboard:** Painel administrativo para técnicos e gestores visualizarem métricas e gerenciarem o atendimento.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
  - [Configuração do Backend](#1-backend)
  - [Configuração do Frontend](#2-frontend-cliente)
  - [Configuração do Dashboard](#3-dashboard-admin)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Autor](#-autor)

---

## ✨ Funcionalidades

* **Autenticação Segura:** Sistema de login com JWT (JSON Web Tokens) e cookies.
* **Controle de Acesso (RBAC):** Diferentes níveis de permissão:
    * **Administrador:** Acesso total ao sistema.
    * **Técnico:** Gestão e atendimento de chamados.
    * **Padrão:** Usuário final (abertura de chamados).
* **Gestão de Chamados:** Criação, visualização e atualização de status de tickets.
* **Dashboard Interativo:** Gráficos de desempenho e métricas utilizando *Recharts*.
* **Upload de Imagens:** Integração com Cloudinary para avatares e anexos.
* **Interface Responsiva:** Desenvolvida com React e componentes modernos (Ant Design, PrimeVue).

---

## 🚀 Tecnologias Utilizadas

### Backend (API)
* **Node.js** & **Express**
* **MongoDB** & **Mongoose** (Banco de dados NoSQL)
* **JWT** & **Bcrypt** (Segurança)
* **Cloudinary** (Gerenciamento de Mídia)

### Frontend (Cliente)
* **React.js** (Vite)
* **React Router Dom** (Navegação)
* **Axios** (Requisições HTTP)
* **React Toastify** (Notificações)

### Dashboard (Admin/Técnico)
* **React.js** (Vite)
* **Ant Design (Antd)** & **PrimeVue** (UI Components)
* **Recharts** (Visualização de Dados)

---

## 📂 Estrutura do Projeto

```bash
HelpDesk_System/
├── backend/       # Servidor e API Node.js
├── frontend/      # Aplicação do Usuário Final
└── dashboard/     # Aplicação Administrativa
