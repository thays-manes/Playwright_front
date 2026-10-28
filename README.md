# Automação de Testes Web com Playwright + TypeScript

![Playwright](https://img.shields.io/badge/Playwright-1.64-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)

## 1. Objetivo

Projeto de automação de testes E2E construído com **Playwright Test** e **TypeScript**, usando a arquitetura
**Page Objects Model (POM)**, fixtures reutilizáveis, configuração por ambiente e análise estática.

A aplicação alvo é o [Sauce Demo](https://www.saucedemo.com), um e-commerce público criado especificamente para
a prática de automação de testes. Os testes cobrem:

| Funcionalidade | Cenários |
| --- | --- |
| Login | acesso válido, usuário bloqueado, logout |
| Validações de login | credenciais inválidas, usuário obrigatório, senha obrigatória, rota protegida |
| Página inicial | elementos principais, contador do carrinho, ordenação por preço e por nome |
| Checkout | **compra completa de ponta a ponta**, cálculo de subtotal/taxa/total, remoção de item, cancelamento, campos obrigatórios do comprador |

São 18 cenários, todos executados em **Chromium, Firefox e WebKit** (54 execuções).

### Fluxo de compra completo

O cenário *Deve concluir uma compra de ponta a ponta com sucesso* percorre toda a jornada do cliente:

1. Login com usuário válido
2. Adição de dois produtos ao carrinho e conferência do contador
3. Conferência dos itens no carrinho
4. Preenchimento dos dados do comprador (gerados pela `TestDataFactory`)
5. Conferência do resumo: itens, pagamento e entrega
6. Finalização do pedido e validação da mensagem de confirmação
7. Carrinho vazio e retorno à página inicial

Os testes de checkout recebem a tag `@destructive`, pois criam pedidos, e por isso nunca rodam com `TEST_ENV=prod`.

## 2. Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior (LTS recomendada)
- npm (instalado junto com o Node.js)
- Git
- Visual Studio Code (opcional) com a extensão *Playwright Test for VSCode*

```bash
node --version
```

## 3. Estrutura de diretórios

```text
playright/
├── .github/workflows/playwright.yml  # Pipeline de CI (GitHub Actions)
├── config/
│   ├── environments.ts       # Ambientes (demo, dev, hml, prod) e baseURL
│   └── global-setup.ts       # Limpeza dos resultados do Allure antes da execução
├── src/
│   ├── actions/
│   │   ├── FormActions.ts        # Preenchimento e envio genérico de formulários
│   │   └── NavigationActions.ts  # Rotas da aplicação e navegação
│   ├── components/
│   │   ├── CartItemsComponent.ts # Lista de itens (carrinho e resumo do pedido)
│   │   ├── HeaderComponent.ts    # Cabeçalho: logo, carrinho, menu
│   │   └── MenuComponent.ts      # Menu lateral: logout, reset de estado
│   ├── data/
│   │   ├── checkout.ts           # Mensagens e títulos do checkout
│   │   ├── products.ts           # Nomes dos produtos do catálogo
│   │   └── users.ts              # Usuários (via .env) e mensagens de login
│   ├── fixtures/
│   │   └── testFixtures.ts       # Fixtures das páginas
│   ├── pages/
│   │   ├── base/BasePage.ts            # Comportamento comum a todas as páginas
│   │   ├── CartPage.ts                 # Carrinho
│   │   ├── CheckoutInformationPage.ts  # Checkout 1/3: dados do comprador
│   │   ├── CheckoutOverviewPage.ts     # Checkout 2/3: resumo e valores
│   │   ├── CheckoutCompletePage.ts     # Checkout 3/3: confirmação
│   │   ├── HomePage.ts                 # Catálogo de produtos
│   │   └── LoginPage.ts                # Tela de login
│   ├── types/index.ts            # Tipos e interfaces compartilhados
│   └── utils/
│       ├── currency.ts           # Conversão e arredondamento de preços
│       ├── Environment.ts        # Leitura e validação de variáveis de ambiente
│       ├── Logger.ts             # Logger com níveis
│       ├── step.ts               # Decorator @step para os relatórios
│       └── TestDataFactory.ts    # Geração de massa de dados descartável
├── tests/
│   ├── checkout/checkout.spec.ts
│   ├── home/home.spec.ts
│   └── login/
│       ├── login.spec.ts
│       └── login-validation.spec.ts
├── .env.example
├── allurerc.mjs              # Configuração do Allure Report
├── eslint.config.js
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

> `test-results/`, `playwright-report/`, `allure-results/`, `allure-report/` e `allure-history/` são gerados
> automaticamente e não são versionados.

## 4. Instalação das dependências

```bash
npm ci
```

## 5. Instalação dos navegadores

```bash
npx playwright install chromium firefox webkit
```

No Linux, para instalar também as bibliotecas de sistema exigidas pelos navegadores:

```bash
npm run install:browsers
```

## 6. Configuração das variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

| Variável | Descrição |
| --- | --- |
| `TEST_ENV` | Ambiente alvo: `demo` (padrão), `dev`, `hml` ou `prod` |
| `BASE_URL` | URL do ambiente `demo` (padrão: `https://www.saucedemo.com`) |
| `BASE_URL_DEV` / `BASE_URL_HML` / `BASE_URL_PROD` | URLs dos demais ambientes |
| `TEST_USERNAME` / `TEST_PASSWORD` | Usuário válido |
| `TEST_LOCKED_USERNAME` | Usuário bloqueado |
| `TEST_TIMEOUT`, `EXPECT_TIMEOUT`, `ACTION_TIMEOUT`, `NAVIGATION_TIMEOUT` | Timeouts em ms |
| `LOG_LEVEL` | `debug`, `info`, `warn` ou `error` |

No Sauce Demo, os nomes de usuário e a senha de demonstração estão publicados na própria tela de login.

- O `.env` está no `.gitignore` — **nunca versione credenciais**.
- Testes que dependem de credenciais são **pulados com aviso** quando as variáveis não estão definidas.
- Ao usar `TEST_ENV=prod`, os testes marcados com `@destructive` são excluídos automaticamente.

Trocando de ambiente sem alterar os testes:

```bash
TEST_ENV=hml npm test
```

No PowerShell:

```powershell
$env:TEST_ENV="hml"; npm test
```

## 7. Executar todos os testes

```bash
npm test
```

## 8. Executar por navegador

```bash
npm run test:chromium
```

```bash
npm run test:firefox
```

```bash
npm run test:webkit
```

Executar um único arquivo ou filtrar pelo nome do teste:

```bash
npx playwright test tests/login/login.spec.ts
```

```bash
npx playwright test -g "credenciais inválidas"
```

## 9. Modo visível, interativo e debug

```bash
npm run test:headed
```

```bash
npm run test:ui
```

```bash
npm run test:debug
```

## 10. Relatórios

O projeto gera dois relatórios a cada execução. **Todos os cenários, aprovados ou reprovados, recebem um
screenshot da tela ao final.** Nos que falham, também são anexados vídeo, trace e o contexto do erro.

### Allure Report (principal)

O [Allure Report 3](https://allurereport.org) roda apenas com Node.js, sem precisar de Java, e oferece:

- **Dashboard com gráficos**: porcentagem de testes aprovados e reprovados, distribuição por severidade, tendência
  de status entre execuções e duração dos testes;
- cada cenário com seus **steps de negócio** (ex.: *Fazer login com o usuário "standard_user"*), screenshot,
  vídeo e trace;
- organização por navegador, épico (*Autenticação*, *Catálogo*), funcionalidade e severidade;
- metadados da execução: ambiente, URL, versão do Node.js e sistema operacional.

Depois de rodar os testes, gere o relatório e abra no navegador:

```bash
npm run allure:report
```

Ou em etapas:

```bash
npm run allure:generate
```

```bash
npm run allure:open
```

Ao abrir, escolha **Awesome** para ver os cenários em detalhe ou **Dashboard** para ver os gráficos. O gráfico de
tendência (*Status dynamics*) passa a ser preenchido a partir da segunda execução, porque usa o histórico salvo
em `allure-history/`.

Arquivos envolvidos:

| Arquivo | Função |
| --- | --- |
| `allurerc.mjs` | Configuração do Allure: nome, plugins (awesome e dashboard) e histórico |
| `config/global-setup.ts` | Limpa `allure-results/` antes de cada execução |
| `src/utils/step.ts` | Decorator `@step` que transforma métodos das páginas em steps nos relatórios |

Classificando um teste no Allure:

```ts
import * as allure from 'allure-js-commons';

test('Deve ...', async () => {
  await allure.severity(allure.Severity.CRITICAL);
  // ...
});
```

### Relatório HTML do Playwright

```bash
npm run report
```

Para abrir um trace específico:

```bash
npx playwright show-trace test-results/<pasta-do-teste>/trace.zip
```

## 11. Como criar uma nova Page Object

1. Crie o arquivo em `src/pages/`, estendendo `BasePage`.
2. Adicione a rota em `Routes` (`src/actions/NavigationActions.ts`).
3. Declare os locators no construtor, priorizando `getByRole`, `getByLabel` e `getByPlaceholder`;
   use `getByTestId` (atributo `data-test`) quando o elemento não tiver nome acessível.
4. Crie métodos que representem **ações do usuário** — sem asserções.

```ts
import type { Locator, Page } from '@playwright/test';
import { Routes } from '../actions/NavigationActions';
import { BasePage } from './base/BasePage';

export class CartPage extends BasePage {
  protected readonly route = Routes.cart;

  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
```

5. Registre a página em `src/fixtures/testFixtures.ts`:

```ts
cartPage: async ({ page }, use) => {
  await use(new CartPage(page));
},
```

## 12. Como criar um novo teste

Crie um arquivo `*.spec.ts` dentro de `tests/<funcionalidade>/` e importe `test` e `expect` **das fixtures do
projeto** (não diretamente de `@playwright/test`):

```ts
import { expect, test } from '../../src/fixtures/testFixtures';

test('Deve exibir o carrinho vazio', async ({ authenticatedHomePage: homePage }) => {
  await homePage.header.openCart();
  await expect(homePage.header.cartBadge).toBeHidden();
});
```

## 13. Como utilizar fixtures

| Fixture | Entrega |
| --- | --- |
| `loginPage` | Instância de `LoginPage` |
| `homePage` | Instância de `HomePage` (sem login) |
| `authenticatedHomePage` | `HomePage` com o usuário padrão já autenticado |
| `cartPage` | Instância de `CartPage` |
| `checkoutInformationPage` | Instância de `CheckoutInformationPage` |
| `checkoutOverviewPage` | Instância de `CheckoutOverviewPage` |
| `checkoutCompletePage` | Instância de `CheckoutCompletePage` |

Cada fixture é criada a partir do `page` do próprio teste, então testes paralelos nunca compartilham estado.

## 14. Boas práticas de organização dos métodos

| Onde | O quê |
| --- | --- |
| `pages/` | Locators e ações específicas de uma página |
| `components/` | Partes da interface repetidas em várias páginas (cabeçalho, menu) |
| `actions/` | Comportamentos genéricos reutilizáveis entre páginas (formulários, rotas) |
| `data/` | Usuários e mensagens esperadas |
| `utils/` | Infraestrutura: ambiente, logs, geração de dados |
| `fixtures/` | Criação e injeção das páginas nos testes |
| `tests/` | **Somente aqui ficam as asserções (`expect`)** |

Regras adicionais:

- Não use `page.waitForTimeout()`; confie no auto-wait dos locators e nas asserções web-first (`toBeVisible`,
  `toHaveText`, `toHaveURL`). O ESLint bloqueia `waitForTimeout` nos testes.
- Sempre use `await` em chamadas do Playwright (regra `no-floating-promises` ativa).
- Não crie uma "super classe" com tudo; também não fragmente em camadas sem propósito.
- Marque com `@destructive` no título os testes que alteram dados.

## 15. Solução de problemas comuns

| Problema | Solução |
| --- | --- |
| `Executable doesn't exist at ...ms-playwright...` | Rode `npx playwright install` |
| `Variável de ambiente obrigatória "X" não definida` | Copie `.env.example` para `.env` e preencha |
| Testes aparecem como *skipped* | Credenciais ausentes no `.env` |
| `TEST_ENV inválido` | Use `demo`, `dev`, `hml` ou `prod` |
| Timeout ao localizar elemento | Abra o trace (`npx playwright show-trace`) e confira o seletor com `npx playwright codegen <url>` |
| Falha só no CI | Baixe o artefato `allure-report` do job e abra com `npx allure open <pasta>` |
| `allure open` mostra relatório antigo | Rode `npm run allure:generate` antes de abrir |
| Bibliotecas ausentes no Linux | `npx playwright install-deps` |

## Qualidade de código

```bash
npm run typecheck
```

```bash
npm run lint
```

## Integração contínua

O workflow em `.github/workflows/playwright.yml` executa typecheck, lint e os testes em cada push e pull request.
Configure em **Settings → Secrets and variables → Actions** os secrets `TEST_USERNAME`, `TEST_PASSWORD` e
`TEST_LOCKED_USERNAME`.
