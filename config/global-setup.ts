import fs from 'node:fs'; // módulo do Node para trabalhar com arquivos e pastas
import path from 'node:path'; // módulo do Node para montar caminhos de pastas

/**
 * Executado UMA vez antes de todos os testes (configurado em playwright.config.ts → globalSetup).
 * Apaga a pasta allure-results da execução anterior, para o relatório Allure mostrar
 * só a execução atual. O histórico para os gráficos de tendência fica guardado em outro lugar
 * (allure-history), então não se perde.
 */
export default function globalSetup(): void {
  // rmSync apaga a pasta. recursive: apaga tudo dentro dela. force: não dá erro se ela não existir.
  fs.rmSync(path.resolve(process.cwd(), 'allure-results'), { recursive: true, force: true });
}
