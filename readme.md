# 🔗 URL Shortener API

API de encurtamento de URLs desenvolvida com **Fastify**, focada em altíssima performance, baixa latência e resiliência de infraestrutura através de **Docker** e **Redis**.

## 🛠️ Tecnologias e Stack

- **Runtime:** [Node.js](https://nodejs.org/) (TypeScript)
- **Framework:** [Fastify](https://www.fastify.io/) (Focado em baixo overhead e alta vazão)
- **ORM:** [Prisma](https://www.prisma.io/) com PostgreSQL 16
- **Cache:** [Redis 7](https://redis.io/) (via ioredis)
- **Validação:** [Zod](https://zod.dev/) & Fastify Type Provider Zod
- **Infraestrutura:** Docker & Docker Compose (Multi-stage builds)
- **Testes:** Jest

## 🧠 Arquitetura e Decisões Técnicas (V1.0)

O projeto foi estruturado para ser modular, tipado e pronto para ambientes de produção containerizados:

- **Docker Multi-Stage Build:** O `Dockerfile` utiliza estágios de `builder` e `runner`. A imagem final contém apenas os binários e dependências de produção, otimizando o tamanho da imagem e a segurança.
- **Resiliência de Inicialização:** Configuração de **Healthchecks** no Docker Compose. A API aguarda a prontidão real do PostgreSQL e do Redis antes de iniciar, evitando falhas de conexão no boot.
- **Estratégia de Cache-Aside:** Sistema de busca otimizado que prioriza o Redis. Em caso de *cache miss*, a aplicação consulta o PostgreSQL e popula o cache com TTL (Time-to-Live), acelerando os próximos redirecionamentos.
- **Coleta de Analytics:** Cada redirecionamento registra automaticamente métricas como `IP`, `User-Agent` e `Referrer`, permitindo o rastreamento de cliques em tempo real.
- **Tratamento de Erros Customizado:** Implementação de um `ErrorHandler` global com suporte a classes de erro customizadas (`MyErrorClass`) para respostas padronizadas e seguras.

## 🧪 Qualidade e Testes

Atualmente, o projeto foca na integridade das regras de negócio:

- **Testes Unitários (Jest):** Cobertura das funções críticas de geração de slugs únicos e lógica de integração com a camada de cache (utilizando mocks para isolamento).

### 🏹 Roadmap para V2.0 (Evolução)
O foco da próxima versão será elevar a maturidade de infraestrutura e testes:
- **Docker Secrets:** Migrar senhas e strings de conexão de variáveis de ambiente para `secrets`, garantindo que credenciais sensíveis nunca fiquem expostas no processo ou em logs.
- **Processamento Assíncrono de Métricas:** Migrar o registro de analytics para Background Jobs (ex: BullMQ), garantindo que o tempo de resposta do redirecionamento não seja afetado pela escrita no banco de dados.
- **Testes de Integração (E2E):** Implementação de testes utilizando `server.inject()` para validar o ciclo completo da requisição HTTP.
- **Ambientes Reais com Testcontainers:** Substituição de mocks por instâncias reais de containers durante a execução dos testes.
- **Roteamento Dinâmico com Traefik:** Implementação de Proxy Reverso para gerenciar tráfego e SSL automático.

## 🚀 Como Executar

### 1. Preparar Ambiente
Certifique-se de ter o **Docker** instalado. O projeto utiliza variáveis de ambiente configuradas diretamente no `docker-compose.yml` para facilitar o setup inicial.

### 2. Subir a Stack Completa
O comando abaixo provisiona o Banco de Dados, o Cache e a API (incluindo o push automático do schema do Prisma):

```bash
docker-compose up -d
```

### 📂 Estrutura de Pastas
```Plaintext

src/
├── modules/      # Lógica de negócio (URLs)
├── plugins/      # Conectores (DB, Cache)
├── types/        # Definições de tipos (Fastify augmentation)
└── index.ts      # Entry point da aplicação
```

Projeto desenvolvido para demonstrar fundamentos de backend, performance com Redis e arquitetura modular com Fastify.
