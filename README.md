# CSI606-2026-01 - Proposta de Trabalho Final

**Discente:** Érick Yuri Coura Paiva Rodrigues

## Resumo

O projeto propõe o desenvolvimento de um Guia de Acessibilidade Urbana Colaborativo, denominado AbleGo. O sistema visa facilitar o cotidiano de pessoas com necessidades especiais ou mobilidade reduzida, permitindo que os usuários encontrem, cadastrem e avaliem o nível de acessibilidade de estabelecimentos comerciais e públicos da região. Através de uma interface web interativa e focada na usabilidade, o sistema cruza as necessidades dos usuários com os recursos oferecidos pelos locais, promovendo a inclusão social e uma tomada de decisão informada para o público PCD.

## 1. Tema

O trabalho final tem como tema o desenvolvimento de uma plataforma web colaborativa para o mapeamento e classificação da acessibilidade urbana. O sistema será desenvolvido com base em uma arquitetura Full-Stack, utilizando React para a construção da interface de usuário (Front-end), Node.js para a lógica de servidor (Back-end) e PostgreSQL como Sistema de Gerenciamento de Banco de Dados Relacional.

## 2. Escopo

Este projeto terá as seguintes funcionalidades:
- **Autenticação e Gestão de Perfis:** Cadastro e login de usuários na plataforma.
- **Diretório de Locais:** Cadastro colaborativo de novos estabelecimentos comerciais, culturais e públicos.
- **Sistema de Avaliação Inclusiva:** Funcionalidade onde os usuários pontuam a presença ou ausência de recursos de acessibilidade específicos (ex: rampas de acesso, banheiros adaptados, cardápios em Braille, piso podotátil, intérprete de Libras, etc.).
- **Interface de Selos Semânticos:** Exibição clara e de alto contraste da acessibilidade dos locais por meio de pílulas visuais (indicadores verdes e vermelhos) para facilitar a carga cognitiva e a leitura rápida.
- **Motor de Busca Estratégico:** Barra de pesquisa e filtros avançados que permitem encontrar estabelecimentos cruzando categorias (ex: restaurantes, museus) com recursos de acessibilidade desejados.

## 3. Restrições

Neste trabalho não serão considerados:
- Desenvolvimento de sistemas de geolocalização avançada em tempo real ou cálculo de rotas detalhadas (estilo Google Maps/Waze).
- Validação documental, jurídica ou auditoria oficial das informações de acessibilidade (os dados inseridos na plataforma têm caráter exclusivamente colaborativo e comunitário).
- Integração com gateways de pagamento comercial ou sistemas de reserva de mesas/ingressos.
- Desenvolvimento de aplicativos nativos para dispositivos móveis (Android/iOS). O projeto será focado em ser uma aplicação web.

## 4. Protótipo

Os protótipos das telas que compõem o fluxo principal do sistema foram elaborados e podem ser acessados nos links abaixo:

1. [Tela Inicial](./public/home-screen.jpeg)
2. [Cadastro de Usuário](./public/cadastro-usuario.png)
3. [Login](./public/login.png)
4. [Cadastro de Estabelecimento](./public/cadastro-estabelecimento.png)
5. [Avaliação de Local](./public/avaliacao.png)

> **Nota:** As imagens dos protótipos estão armazenadas na pasta `./public` deste repositório para referência visual do fluxo e interface.




## 5. Referências

- META. **React: A JavaScript library for building user interfaces.** Disponível em: <https://react.dev/>. Acesso em: 27/04/2026.
- OPENJS FOUNDATION. **Node.js Documentation.** Disponível em: <https://nodejs.org/en/docs/>. Acesso em: 27/04/2026.
- POSTGRESQL GLOBAL DEVELOPMENT GROUP. **PostgreSQL Documentation.** Disponível em: <https://www.postgresql.org/docs/>. Acesso em: 27/04/2026.