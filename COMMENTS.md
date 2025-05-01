# Registro de Decisão de Arquitetura

## Backend

A arquitetura escolhida para o backend foi a [**arquitetura em camadas**](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html). A arquitetura em questão pode-se considerar um esboço de [**Clean Architecture**](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

São elas:

- **Controllers** (`server/src/controllers`): Camadas de apresentação, onde o usuário interage com a aplicação. É responsável por receber, validar requisições, chamar seu respectivo caso de uso, e retornar a resposta.
- **Use Cases** (`server/src/useCases`): Camada de aplicação, onde a lógica de negócio é implementada. É responsável por orquestrar as chamadas entre os repositórios e os controladores.
- **Repositories** (`server/src/repositories`): Camada de persistência, onde os dados são armazenados. É responsável por acessar o banco de dados e retornar os dados para a camada de aplicação.

### Decisão

A decisão de usar a arquitetura em camadas foi tomada baseado-se nos seguintes benefícios:

- Separação de responsabilidade;
- Modularidade;
- Testabilidade;
- Facilidade de manutenção;
- Escalabilidade.

Em complemento à arquitetura em camadas, padrões de projetos e princípios do **SOLID** foram utilizados para garantir a qualidade do código e facilitar a manutenção e evolução do sistema.

**Padrões de projeto:**

- **[Repository](https://www.branas.io/blog/o-que-e-e-quando-devemos-utilizar-o-padrao-repository.html)**: Utilizado para abstrair o acesso aos dados.
- **[Factory](https://www.patterns.dev/vanilla/factory-pattern/)**: Utilizado para criar instâncias de objetos.
- **[Singleton](https://www.patterns.dev/vanilla/singleton-pattern/)**: Utilizado para garantir que uma classe tenha apenas uma instância ao longo do ciclo de vida da aplicação.
- **[Adapter](https://www.patterns.dev/vanilla/adapter-pattern/)**: Utilizado para adaptar uma interface a outra, e com isso, reduzir o acoplamento entre a aplicação e a biblioteca de terceiros.

**Princípios do SOLID:**

- **[Single Responsibility Principle (SRP)](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#single-responsibility-principle)**: Cada classe deve ter uma única responsabilidade. Isso é, cada classe deve ter apenas um motivo para mudar.
- **[Open/Closed Principle (OCP)](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#open-closed-principle)**: As classes devem estar abertas para extensão, mas fechadas para modificação. Isso é, devemos ser capazes de adicionar novas funcionalidades sem modificar o código existente.
- **[Dependency Inversion Principle (DIP)](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#dependency-inversion-principle)**: As classes de alto nível não devem depender de classes de baixo nível. Ambas devem depender de abstrações. Isso é, devemos depender de interfaces e não de implementações concretas.

## Banco de dados

O banco de dados escolhido foi o **Postgres**. Não há nenhum motivo específico para a escolha do **Postgres**, escolhi porque já conheço.

**Não foi utilizado nenhum ORM**, todas as consultas foram feitas com SQL utilizando o `pg`.

As tabelas do banco são as seguintes:

![alt text](/db-diagram.png)

## API Design

A arquitetura escolhida para a API foi a **[REST](https://restfulapi.net/)**. A API foi projetada para ser simples e fácil de usar, seguindo os princípios REST.

### Autenticação

O método de autenticação utilizado foi o **[JWT](https://jwt.io/)**. O JWT define um formato compacto e independente para a transmissão segura de informações entre partes como um objeto JSON. Essas informações podem ser verificadas e confiáveis porque são digitalmente assinadas.

A autenticação foi implementada através de access e refresh tokens. O access token é utilizado para autenticar o usuário e o refresh token é utilizado para renovar o access token quando ele expira de forma transparente para o usuário.

### Autorização

A autorização foi implementada utilizando o **[RBAC](https://auth0.com/docs/manage-users/access-control/rbac)**. O RBAC é um modelo de controle de acesso baseado em papéis, onde os usuários são atribuídos a papéis e os papéis têm permissões associadas.

O controle de acesso foi implementado com duas roles, são elas:

- **Coordenador Acadêmico** pode criar, editar e excluir estudantes.
- **Professor** não pode criar, editar ou excluir estudantes, mas pode visualizar os dados dos estudantes.

### Decisões de performance

- **Connection Pool**: Utilizado para melhorar a performance da aplicação reutilizando conexões ao banco de dados, reduzindo o tempo de resposta e a carga no banco de dados.
- **Indexação**: Não foi criado nenhum index explicitamente, todos vieram de `PRIMARY KEY` e `UNIQUE`. Porém fica aqui o adendo, é sempre importante criar índices para melhorar a performance das consultas ao banco de dados.
- **Paginação**: Utilizado para melhorar a performance da aplicação limitando o número de dados retornados em uma única requisição, reduzindo o tempo de resposta e a carga no banco de dados. Foi utilizado a abordagem de paginação baseada em offset e limit, onde o cliente pode solicitar um número específico de itens a serem retornados. Em uma aplicação que a quantidade de estudantes fosse consideravelmente alta, o ideal seria utilizar a paginação baseada em cursor, que é mais eficiente e escalável.
- **Cacheamento de dados**: Utilizado para melhorar a performance da aplicação armazenando dados que são frequentemente acessados, reduzindo o número de requisições ao banco de dados. Foi utilizado o `node-cache` para cachear os dados. Em uma aplicação real, o ideal seria utilizar um cache distribuído, como o **Redis**.
- **Rate Limiting**: Utilizado para limitar o número de requisições que um cliente pode fazer em um determinado período de tempo, evitando sobrecarga no servidor e garantindo a disponibilidade da aplicação. Foi utilizado o `express-rate-limit` para implementar o rate limiting. Em uma aplicação real, o ideal seria utilizar um serviço de rate limiting, como o [**Cloudflare**](https://www.cloudflare.com/) ou o [**AWS API Gateway**](https://aws.amazon.com/pt/api-gateway/).

### API Collection

Para facilitar o teste da API, foi criada uma collection para o [**Postman**](https://www.postman.com/) que pode ser baixada em [**aqui**](/+a%20Educação%20API.postman_collection.json). A collection contém todas as rotas da API e exemplos de requisições.

## Qualidade da API

Foi escrito testes unitários para todas as camadas com um **coverage de 60%**.

## Frontend

A arquitetura escolhida para o frontend foi, essencialmente, padrões de projeto do Vue.js em conjunto com o **[Single Responsibility Principle (SRP)](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#single-responsibility-principle)** e **[Open/Closed Principle (OCP)](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design#open-closed-principle)** do **SOLID**.

### Decisão

A decisão de utilizar padrões já existentes e recomendados pelo **Vue.js** foi tomada na mesma linha do Backend, baseando nos benefícios:

- Separação de responsabilidade;
- Modularidade;
- Testabilidade;
- Facilidade de manutenção;
- Escalabilidade.

**Padrões de projeto**:

- **[Components](https://vuejs.org/guide/essentials/component-basics.html)**: Utilizado para criar componentes reutilizáveis e modulares.
- **[Composition API](https://vuejs.org/guide/introduction.html#composition-api)**: Utilizado para criar componentes com menos boilerplate e mais legibilidade.
- **[Composables](https://vuejs.org/guide/reusability/composables.html)**: Utilizado para criar funções reutilizáveis e modulares.

# Bibliotecas de terceiros utilizadas

## Backend

- [**express**](https://expressjs.com/): Framework para construção de APIs em Node.js.
- [**typescript**](https://www.typescriptlang.org/): Linguagem de programação que é um superconjunto do JavaScript.
- [**cors**](https://www.npmjs.com/package/cors): Middleware para habilitar o CORS (Cross-Origin Resource Sharing).
- [**express-rate-limit**](https://www.npmjs.com/package/express-rate-limit): Middleware para limitar o número de requisições em um determinado período de tempo.
- [**node-cache**](https://www.npmjs.com/package/node-cache): Biblioteca para cache de dados em memória.
- [**morgan**](https://www.npmjs.com/package/morgan): Middleware para log de requisições HTTP.
- [**jsonwebtoken**](https://www.npmjs.com/package/jsonwebtoken): Biblioteca para criar e verificar tokens JWT.
- [**bcryptjs**](https://www.npmjs.com/package/bcryptjs): Biblioteca para hash de senhas.
- [**pg**](https://node-postgres.com/): Biblioteca para conexão com o banco de dados Postgres.
- [**zod**](https://zod.dev/): Biblioteca para validação de dados.
- [**tsx**](https://www.npmjs.com/package/tsx): Biblioteca para executar arquivos TypeScript diretamente no Node.js.
- [**Vitest**](https://www.npmjs.com/package/vitest): Biblioteca para testes unitários.
- [**tsup**](https://www.npmjs.com/package/tsup): Biblioteca para empacotamento de arquivos TypeScript.
- [**eslint**](https://eslint.org/): Ferramenta para análise de código estático.
- [**prettier**](https://prettier.io/): Ferramenta para formatação de código.
- [**husky**](https://typicode.github.io/husky/#/): Ferramenta para executar scripts antes de fazer um commit.
- [**lint-staged**](https://github.com/lint-staged/lint-staged): Ferramenta para executar scripts apenas em arquivos que foram alterados.

## Frontend

- [**Vue.js**](https://vuejs.org/): Framework JavaScript para construção de interfaces de usuário.
- [**Vue Router**](https://router.vuejs.org/): Biblioteca para gerenciamento de rotas no Vue.js.
- [**Vuetify**](https://vuetifyjs.com/en/): Biblioteca de componentes UI para Vue.js.
- [**Tanstack Form**](https://tanstack.com/form/latest): Biblioteca para gerenciamento de formulários.
- [**Tanstack Query**](https://tanstack.com/query/latest): Biblioteca para gerenciamento de estado assíncrono no Vue.js.
- [**Axios**](https://axios-http.com/): Biblioteca para fazer requisições HTTP.
- [**Vue3 Toastify**](https://vue3-toastify.com/): Biblioteca para exibir notificações no Vue.js.
- [**zod**](https://zod.dev/): Biblioteca para validação de dados.
- [**typescript**](https://www.typescriptlang.org/): Linguagem de programação que é um superconjunto do JavaScript.
- [**Vite**](https://vitejs.dev/): Ferramenta de construção e desenvolvimento para aplicações Vue.js.
- [**eslint**](https://eslint.org/): Ferramenta para análise de código estático.
- [**prettier**](https://prettier.io/): Ferramenta para formatação de código.
- [**husky**](https://typicode.github.io/husky/#/): Ferramenta para executar scripts antes de fazer um commit.
- [**lint-staged**](https://github.com/lint-staged/lint-staged): Ferramenta para executar scripts apenas em arquivos que foram alterados.

# Melhorias

Antes de listar as melhorias, gostaria de ressaltar que em um cenário real, o fluxo de desenvolvimento seria atrás de branches e pull requests. Por se tratar de um teste técnico os commits foram realizados na `master` diretamente.

A lista de melhorias a seguir foi realizada para uma aplicação real em produção, e não para o teste técnico em si.

## Backend

- **Testes unitários**: Aumentar o coverage para, pelo menos, 80%.
- **Testes de integração**: Implementar testes de integração para garantir que as rotas da API funcionam corretamente.
- **Documentação**: Implementar a documentação da API utilizando o [**Swagger**](https://swagger.io/) ou qualquer outro serviço de documentação de APIs. A documentação da API é importante para garantir que os desenvolvedores que utilizam a API saibam como utilizá-la corretamente.
- **Compressão de resposta**: Implementar a compressão de resposta para melhorar a performance da aplicação em grandes payloads, reduzindo o tamanho das respostas enviadas para o cliente. O ideal seria utilizar o **Gzip** ou qualquer outro serviço de compressão.
- **Load Balancer**: Implementar um balanceador de carga para distribuir as requisições entre várias instâncias da aplicação, melhorando a performance e a escalabilidade da aplicação. O ideal seria utilizar um serviço de balanceamento de carga, como o [**AWS Elastic Load Balancing**](https://aws.amazon.com/pt/elasticloadbalancing/) ou qualquer outro.
- **Retries**: Implementar retries para garantir que as requisições, como por exemplo ao banco de dados ou sistemas externos, sejam feitas novamente em caso de falha.

## Frontend

- **Testes unitários**: Aumentar o coverage para, pelo menos, 80%.
- **Testes de integração**: Implementar testes de integração para garantir que todas as partes da aplicação funcionem corretamente juntas.
- **Code Splitting**: Implementar o code splitting para melhorar a performance da aplicação, dividindo o código em partes menores e carregando apenas o que é necessário.
- **Controle de acesso**: Embora tenha sido implementado e está 100% funcional no backend, o controle de acesso não foi implementado no frontend. O ideal seria implementar o controle de acesso também no frontend para garantir que os usuários só possam recursos que estão autorizados.

## Melhorias gerais

- **Monitoramento**: Implementar monitoramento da aplicação para garantir que a aplicação esteja funcionando corretamente e para identificar problemas rapidamente. O ideal seria utilizar um serviço de monitoramento, como o [**Sentry**](https://sentry.io/welcome/), ou qualquer outro, em conjunto com o [**Microsoft Clarity**](https://clarity.microsoft.com/) para entender o comportamento do usuário e identificar problemas de usabilidade e espaço para melhoria.
- **CI/CD**: Implementar um pipeline de CI/CD para garantir que a aplicação esteja segura a falhas e garantir que toda versão que seja implantada esteja funcionando corretamente. O ideal seria utilizar um serviço de CI/CD, como o [**GitHub Actions**](https://github.com/features/actions), ou qualquer outro.

# Requisitos

Todos os requisitos foram atendidos.
