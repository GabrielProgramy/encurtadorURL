# 🚀 URL Shortener API

API de encurtamento de URLs desenvolvida com **Fastify**, focada em altíssima performance e baixa latência através de estratégias de cache com **Redis**.

## 🛠️ Tecnologias

- **Framework:** [Fastify](https://www.fastify.io/) (focado em baixo overhead)
- **Linguagem:** TypeScript
- **ORM:** [Prisma](https://www.prisma.io/) com PostgreSQL
- **Cache:** [Redis](https://redis.io/) (via ioredis)
- **Testes:** [Jest](https://jestjs.io/)
- **Containerização:** Docker & Docker Compose

## 🧠 Arquitetura e Decisões Técnicas

O projeto foi estruturado seguindo princípios de modularidade e separação de preocupações:

- **Fastify Plugins:** Implementação de conectores customizados para o Banco de Dados e Cache utilizando `fastify-plugin`, garantindo o encapsulamento e a disponibilidade das instâncias em toda a aplicação.
- **Cache-Aside Pattern:** A lógica de busca de URLs prioriza o Redis. Em caso de *cache miss*, a aplicação recorre ao PostgreSQL e popula o cache automaticamente para as próximas requisições.
- **Schemas de Validação:** Uso de JSON Schemas nativos do Fastify para validação de entrada e serialização de saída, garantindo integridade e performance.
- **Lógica de Geração:** Algoritmo manual para criação de slugs (short codes) de 4 caracteres, demonstrando o funcionamento interno de sistemas de encurtamento.

## 🚀 Como Executar

### 1. Preparar Ambiente
Certifique-se de ter o **Docker** instalado. Crie um arquivo `.env` com base nas variáveis:
```env
DATABASE_URL=""
REDIS_HOST=""
REDIS_PORT=6
```

### 2. Subir Infraestrutura (Docker)

```Bash
docker-compose up -d
```

### 3. Instalação e Execução
```Bash
npm install
npm run dev
```

🧪 Testes

O projeto conta com testes unitários cobrindo os serviços principais:
```Bash

npm test
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