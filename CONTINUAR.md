# Continuidade — Sistemas WS

## Projeto certo

- Site institucional: https://sistemasws.com
- Alias: https://www.sistemasws.com e https://sistemas-ws.pages.dev
- Repositório: https://github.com/wnsbarros-png/sistemasws
- Hospedagem: Cloudflare Pages, projeto `sistemas-ws`.
- Cloudflare account: `3cbae68b698272be4ad4aa04e008bb29`.
- Cloudflare project: `63ccd663-79bc-46c9-8f52-9679f9461ced`.
- Cloudflare zone: `41a1ea6e5e3afb34144656175f6686f0`.
- Site estático HTML/CSS/JavaScript, sem framework, banco de dados ou funções.
- O repositório tinha apenas README. O código publicado foi recuperado do Pages nesta revisão e agora está versionado aqui.

## Escopo aprovado em 15/10/2026

Wanderson aprovou manter a identidade azul e melhorar a abertura, a apresentação de ClippPro/ZWeb/Gfood, a navegação no celular, o peso das imagens e a acessibilidade.

## Alterações

- Título curto: “Sua gestão, mais simples.”, duas linhas nos cinco tamanhos testados.
- CTA principal para WhatsApp; atalho secundário para os sistemas.
- Menu móvel com botão, aria-expanded, teclado, Escape e fechamento ao navegar.
- Produtos alternados no computador; descrição e contato antes das imagens no celular.
- Grades, espaçamentos, fonte Segoe UI, superfícies claras e cantos retos consistentes.
- Link de pular para conteúdo, foco visível, alvos de toque, dimensões explícitas das imagens e movimento reduzido.
- Imagens WebP: cerca de 357 KB no total, contra 5,7 MB nos originais. Materiais completos, sem cortes.
- Originais permanecem no deploy e no repositório para preservar referências e permitir novas otimizações.
- Canonical, Open Graph, theme-color, robots.txt, sitemap.xml e cabeçalhos básicos.
- Links de WhatsApp pré-preenchidos continuam funcionando sem JavaScript; config ausente usa o número comercial existente.

## Dados que devem ser preservados

- WhatsApp: `5566996965492`, em `config.js`.
- E-mail publicado: `contato@sistemasws.org`.
- Não inventar clientes, depoimentos, preços ou métricas de negócio.
- As marcas dos produtos e imagens de apresentação existentes foram preservadas.
- A imagem do caixa é ilustrativa, criada por IA; isso está descrito no alt.
- Não alterar DNS, nameservers, Microsoft 365, e-mail ou transferência de domínio como parte de uma alteração visual.

## Skills

Instaladas no projeto usando `npx skills add`, com registros em `skills-lock.json`:

- Leonxlnx/taste-skill: design-taste-frontend e image-to-code.
- vercel-labs/agent-skills: web-design-guidelines.
- bergside/awesome-design-skills: coleção completa; referência corporativa pertinente ao site.
- microsoft/playwright-cli: playwright-cli.

São 71 skills instaladas. Os arquivos gerenciados ficam em `.agents/skills`, ignorados pelo Git; podem ser restaurados com `npx skills experimental_install`. Não misturar estilos incompatíveis da coleção num único site.

## Verificação

`npm ci` e `npm run check` executam Playwright/Chrome e axe-core em 320, 390, 768, 1024 e 1440 px. Chrome deve estar instalado; `WS_CHROME_PATH` permite apontar outro executável. Em Linux, o padrão é o canal Chrome.

`WS_TEST_URL` permite testar a prévia ou produção. O teste não envia mensagens. Confere rolagem lateral, imagens, dimensões, âncoras, segurança de links, número e textos do WhatsApp, menu por teclado, funcionamento sem JavaScript e configuração ausente.

Resultados locais e na prévia: sem violações automatizadas WCAG A/AA verificadas, sem erros de execução, sem rolagem lateral. Auditoria automatizada não substitui avaliação humana completa de acessibilidade.

Prévia aprovada pelos testes: https://806d87f7.sistemas-ws.pages.dev

## Publicação e recuperação

- Produção anterior à revisão: deployment `a4770534-2713-4c11-905b-6d3289e3ec4b`, URL imutável https://a4770534.sistemas-ws.pages.dev.
- Prévia desta revisão: deployment `806d87f7-1bac-493d-839a-5cbe65a9d0be`.
- A publicação usa upload direto de assets e deployment na branch `main`, com `_headers` e manifest dos arquivos públicos.
- O arquivo `PUBLICACAO.json` registra a produção concluída desta revisão.
- Não incluir node_modules, .agents, .codex, screenshots ou documentos de trabalho no manifesto público.
- Não gravar tokens de upload nem credenciais neste repositório.

## Próxima sessão

Leia este documento e consulte a produção atual no Pages antes de editar. Abra a página publicada e avalie as mudanças com os arquivos deste repositório. Mantenha uma versão anterior disponível para rollback e atualize `PUBLICACAO.json` ao publicar.
