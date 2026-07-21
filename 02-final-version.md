# CSI606-2026-01 - Trabalho Final - Resultados

**Discente:** Érick Yuri Coura Paiva Rodrigues

## Resumo

O projeto entregue é o AbleGo, um Guia de Acessibilidade Urbana Colaborativo. O sistema visa facilitar o cotidiano de pessoas com necessidades especiais ou mobilidade reduzida, permitindo que os usuários encontrem, cadastrem e avaliem o nível de acessibilidade de estabelecimentos. Através de uma interface web interativa, o sistema cruza as necessidades dos usuários com os recursos oferecidos pelos locais, promovendo a inclusão social.

## 1. Funcionalidades implementadas

O sistema foi desenvolvido utilizando a arquitetura Full-Stack (React no Front-end, Node.js no Back-end e PostgreSQL como Banco de Dados) e conta com as seguintes funcionalidades:
*   **Autenticação e Gestão de Perfis:** Cadastro, login e edição de perfil de usuários na plataforma.
*   **Diretório de Locais:** Cadastro colaborativo de novos estabelecimentos comerciais, culturais e públicos no banco de dados.
*   **Sistema de Avaliação Inclusiva:** Os usuários podem pontuar locais e deixar comentários detalhados sobre a acessibilidade, com a possibilidade de anexar evidências fotográficas.
*   **Interface de Selos Semânticos:** Exibição da acessibilidade dos locais por meio de etiquetas visuais claras (ícones e pílulas) e suporte total a leitores de tela (WAI-ARIA) no código-fonte.
*   **Motor de Busca Estratégico:** Barra de pesquisa e filtros interativos por categorias de estabelecimentos e por recursos específicos de acessibilidade.
*   **Integração de Rotas:** Redirecionamento automatizado para o Google Maps utilizando o endereço cadastrado do local.

## 2. Funcionalidades previstas e não implementadas

*   Todas as funcionalidades essenciais propostas no escopo inicial (MVP) foram implementadas com sucesso. A divisão por cidades específicas foi deixada como trabalho futuro para garantir a estabilidade da versão atual.

## 3. Outras funcionalidades implementadas

*   **Acessibilidade Nativa (NVDA):** Todo o sistema foi otimizado para navegação via teclado e leitores de tela, ocultando emojis decorativos e garantindo descrições claras para botões com ícones.
*   **Segurança de Dados:** O sistema impede que usuários excluam ou editem estabelecimentos que não foram criados por eles.

## 4. Principais desafios e dificuldades

*   Garantir que a interface (Front-end em React) e o servidor (Back-end em Node.js) se comunicassem perfeitamente, gerenciando as chamadas assíncronas ao banco de dados PostgreSQL.
*   Aplicar os conceitos avançados de acessibilidade web (WAI-ARIA) para garantir que componentes complexos, como modais e carrosséis, fossem lidos corretamente por softwares como o NVDA.

## 5. Instruções para instalação e execução

Para rodar o projeto localmente, é necessário ter o Node.js e o PostgreSQL instalados.

1. Clone o repositório.
2. Acesse a pasta do servidor (`/server`), instale as dependências com `npm install` e inicie o back-end com `npm start`.
3. Acesse a pasta do front-end (`/src`), instale as dependências com `npm install` e inicie a interface com `npm run dev`.
4. Configure o banco de dados PostgreSQL utilizando os scripts SQL fornecidos no projeto.

## 6. Referências

*   META. React: A JavaScript library for building user interfaces. Disponível em: https://react.dev/. Acesso em: 2026.
*   OPENJS FOUNDATION. Node.js Documentation. Disponível em: https://nodejs.org/en/docs/. Acesso em: 2026.
*   POSTGRESQL GLOBAL DEVELOPMENT GROUP. PostgreSQL Documentation. Disponível em: https://www.postgresql.org/docs/. Acesso em: 2026.
*   W3C. Web Content Accessibility Guidelines (WCAG) 2.1. Disponível em: https://www.w3.org/TR/WCAG21/. Acesso em: 2026.

---

## 🔗 Link da Apresentação

[link do video youtube]