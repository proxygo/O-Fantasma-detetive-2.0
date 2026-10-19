# Publicação no GitHub Pages

O projeto usa Vite e gera o jogo estático na pasta `dist/`.
O endereço relativo em `vite.config.ts` permite carregar as artes em um
subdiretório como `/fantasma-detetive-2/`.

## Primeira publicação

1. Criar um repositório `fantasma-detetive-2` na conta da autora.
2. Enviar o conteúdo desta pasta na raiz do repositório, incluindo `.github/`.
   Não enviar `node_modules/` nem `dist/`; ambos estão no `.gitignore`.
3. Em **Settings → Pages → Source**, selecionar **GitHub Actions**.
4. Executar **Publicar jogo no GitHub Pages**, na aba **Actions**, se o primeiro
   envio já tiver ocorrido antes de configurar Pages.
5. Aguardar a execução bem-sucedida e abrir o endereço exibido na implantação.

O workflow instala as dependências do lockfile, executa os testes, compila e
publica apenas `dist/`. Novos envios à branch `main` repetem esse processo.
O código permanece no repositório; o site público recebe o jogo compilado.

## Verificação

Confirmar no endereço público: onboarding com personagem, biblioteca e botões
carregados, movimento, investigação, conclusão e nova partida.
Uma compilação local aprovada não confirma uma publicação bem-sucedida.

Referência: https://vite.dev/guide/static-deploy.html#github-pages
