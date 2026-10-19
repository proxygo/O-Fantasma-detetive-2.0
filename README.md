# Fantasma Detetive 2.0 — MVP 0.2

Investigação original jogável do início ao fim, com quatro objetos, caderno, resposta, encerramento e nova partida. Arte do personagem e cenário provisórios; interface usa o kit da autora. Esta é uma conclusão funcional do caso original, não a versão artística/narrativa definitiva.

## Jogar

Abra iniciar.cmd neste computador, mantenha a janela do servidor aberta e acesse o endereço mostrado. Para desenvolver em outro computador: Node.js 24, npm install, npm run dev. npm test executa os testes; npm run build verifica tipos e gera dist/; npm run preview abre o build local.

Setas definem a direção, espaço freia e Enter investiga um objeto próximo. Soltar a seta mantém a flutuação. Comece na cadeira e siga as pistas. Diálogos pausam o movimento e fecham pelo botão ou Esc. Sair da área de jogo freia o personagem.

Também há controles de toque e uma seção Explorar por lista, que permite selecionar qualquer objeto e realizar a mesma investigação sem navegação espacial. As pistas podem ser coletadas em qualquer ordem e não se duplicam.

A resposta só fica disponível depois das quatro descobertas. Uma resposta incorreta mantém o progresso para nova tentativa. A resposta correta encerra a partida e impede novas interações. Jogar novamente zera as pistas e o formulário. Não há salvamento entre recarregamentos.

## Como o código funciona

- src/investigation.ts: dados dos quatro objetos (identificador, nome, posição e pista), reutilizando os textos do jogo original, com pontuação e orientação final ajustadas.
- src/game.ts: estado, movimento, proximidade, registro de pistas e verificação da resposta.
- src/main.ts: eventos, diálogos, caderno e transições de interface. Eventos registrados uma única vez.
- src/render.ts: desenho geométrico temporário da sala, quatro objetos e personagem.
- src/style.css e illustrated-ui.css: layout e uso das imagens com texto HTML.
- src/assets/ui/: imagens recebidas, sem retoques. Recursos não utilizados não entram no build.

Adicionar uma pista normalmente significa acrescentar seus dados e sua representação visual. Regras diferentes, novas escolhas e finais exigem lógica e testes; não são apenas cópias de texto. Os testes atuais verificam movimento, limites, proximidade, repetição de objetos, bloqueio de conclusão, erro, vitória e reinício limpo.

## Validação desta entrega

- TypeScript e build de produção aprovados.
- Seis testes automatizados aprovados.
- No navegador: coleta das quatro pistas pelo caminho acessível, tentativa incorreta, resposta correta e nova partida com progresso zerado.
- O percurso espacial usa a mesma função de investigação, com checagem de proximidade testada automaticamente. Não foi feita validação em todos os navegadores/dispositivos.

## Limites e próximos passos

As quatro pistas e a resposta 42 pertencem ao original. Não foram inventados novos acontecimentos nem dois finais narrativos. Ramificações e outros desfechos aguardam definição com a autora. O retorno de erro não é um segundo final narrativo.

Ainda pendentes: arte final de Capitio e biblioteca, refinamento visual, otimização do peso e das bordas das imagens, validação ampliada de acessibilidade e dispositivos, publicação pública/GitHub. Sem áudio nesta versão. O build é estático e usa base relativa para publicação futura em subpastas.

## Atualização 0.3 — onboarding e biblioteca ilustrada

A versão atual substitui o cenário e personagem geométricos por recursos ilustrados separados. O guia aparece antes da partida e pode ser reaberto em Como jogar. Movimento agora aceita também WASD e considera colisões na base dos móveis. Indicadores são contextuais; o nome do objeto aparece ao aproximar-se.

Arquitetura e validações da entrega em docs/entrega-03.md. Prompts de arte em docs/art-prompts-v1.txt. Fontes PNG em src/assets/game/. Os nove testes atuais incluem pausa durante ajuda, colisão e acesso às quatro áreas investigáveis. Dados da investigação permanecem em src/investigation.ts; renderer e recursos em src/render.ts e src/assets.ts.

Esta atualização supera a descrição anterior de arte geométrica provisória: já há a primeira biblioteca ilustrada jogável e a primeira pose ilustrada de Capitio. Ainda há refinamentos e animações específicas a produzir, testes em dispositivos e otimização para publicação.

## Atualização 0.4 — expressões e rabinho

Capitio usa agora um atlas com corpo normal, piscada, sorriso de descoberta e cauda separada. O renderer seleciona as células e gira a cauda pela raiz, atrás do corpo. Piscadas de 160 ms acontecem em intervalos variáveis de aproximadamente 3 a 5 segundos; a cauda balança com amplitude discreta, maior no movimento e na alegria.

Uma pista nova dispara a expressão feliz por 2,4 segundos. No diálogo da descoberta, o retrato mantém o sorriso durante a leitura. Ao fechar, Capitio também sorri por mais 2,4 segundos no cenário. Reexaminar uma pista não dispara alegria nova. Reiniciar limpa o estado da animação. Movimento reduzido desativa piscadas e balanço, preservando o retorno visual estático da descoberta.

A animação visual fica em character-animation.ts, separada das regras de pistas. character.ts monta corpo e cauda; main.ts dispara a reação apenas quando a coleção de pistas cresce. Atlas e prompt estão em src/assets/game/capitio-animation-v1.png e docs/capitio-animation-prompt.txt. Produzido com geração integrada de imagens. Treze testes automatizados cobrem as regras existentes e os novos tempos de reação, piscada, redução de movimento e reinício. Não são novas mecânicas narrativas.

## Ajuste da flutuação e identidade da cauda

O contorno sutil de coração do rabinho é uma característica obrigatória da identidade visual. A nova camada capitio-heart-tail-v1.png preserva os dois volumes arredondados e a reentrância suave entre eles. O renderer continua usando rotação na raiz; não deforma o contorno.

As quatro patinhas usam pequenas rotações alternadas das regiões inferiores do atlas, com sobreposição nas raízes sob o tronco. O movimento tem amplitude menor em repouso e aumenta discretamente no deslocamento. Não é um ciclo de caminhada apoiada no chão. O corpo foi elevado em 18 unidades do mundo, mantendo sombra e colisão no piso; a iluminação e o rastro acompanham a nova altura. Movimento reduzido mantém as patas e a cauda estáticas, com a altura de flutuação preservada.

O teste adicional verifica alternância, limites da amplitude e movimento reduzido das patas. Compilação e 14 testes aprovados. Prompt da cauda em docs/capitio-heart-tail-prompt.txt. Recursos anteriores preservados.

## Correção da cauda — versão 2

A cauda anterior foi substituída: a massa principal da própria cauda agora deve formar um coração legível, contínuo, com raiz curta e larga integrada ao corpo. Não usar cauda normal seguida de nuvem, fumaça, espiral ou coração solto. Esta especificação substitui o desenho anterior mais enrolado.

O jogo desenha somente a nova camada de cauda sobre o corpo sem cauda do atlas; a raiz fica atrás do tronco com sobreposição. Balanço reduzido para preservar o contorno. O rastro de partículas atrás do personagem foi removido, evitando a leitura de emissão. O brilho ao redor do corpo, as partículas ambientais, as patinhas e as expressões permanecem.

Arte em src/assets/game/capitio-heart-tail-v2.png. Versão 1 preservada apenas como arquivo histórico, sem referência no carregamento do jogo. Prompt da geração integrada em docs/capitio-unified-tail-prompt.txt.

### Cauda v3 — ponta curvada visível

A versão atual mantém a massa superior em coração e recupera uma pequena ponta que sai pela borda inferior esquerda e se curva para cima. É uma continuação da mesma cauda, com espaço transparente dentro da curva, sem efeitos destacados. A raiz continua sobreposta ao corpo. O jogo carrega capitio-heart-tail-v3.png; v1 e v2 são apenas histórico. Prompt em docs/capitio-curled-tail-prompt.txt. Não houve mudança de regras nem dos tempos de animação.

## Direção vigente — desenho da autora como referência principal

O personagem atual é uma adaptação mais fiel das ilustrações 23 e 24 da autora: cabeça e focinho largos, olhos pequenos, corpo compacto, patas curtas e contorno simples. O aspecto fantasma é aplicado com sombreamento lavanda discreto, luz suave e flutuação. Esta decisão substitui as interpretações anteriores com pelagem detalhada e olhos maiores.

O atlas em src/assets/game/capitio-desenho-autoral-v1.png reúne os corpos normal, piscando e feliz e a cauda isolada, com coração natural e ponta assimétrica alongada. A cauda é montada atrás do corpo com raiz sobreposta; não há rastro ou nuvem emitida. As regiões de movimento das patas foram realinhadas às novas proporções.

O onboarding e o retrato das pistas também usam o mesmo renderer e atlas. Os arquivos de personagem anteriores permanecem como histórico, mas não entram no build atual. Prompt da adaptação integrada em docs/capitio-desenho-autoral-prompt.txt. Checagem de tipos, build e 14 testes aprovados. Aparência conferida no navegador no cenário, guia e diálogo de nova pista.

## Nova silhueta inferior de fantasma

Cabeça, coleira, expressões e cauda permanecem desenhadas diretamente do atlas autoral aprovado. Abaixo da coleira, o renderer usa capitio-corpo-espectral-v1.png: torso leve, duas pequenas patas dianteiras junto ao peito e base ondulada com três pontas suaves. Não há patas traseiras nem pés apoiados no piso.

Os dois bracinhos/patinhas flutuam com pequena rotação. O movimento inferior é um balanço contínuo que cresce em direção à borda ondulada; substitui a animação de quatro patas. Redução de movimento continua desativando animações, sem mudar a silhueta. A altura acima da sombra e a raiz da cauda foram preservadas. Os pontos de navegação/colisão no piso continuam com as mesmas regras.

A geometria dos quadros foi alinhada pela coleira, e o recorte inferior inclui a borda inteira sem cortar suas ondas. O atlas anterior permanece necessário para desenhar a cabeça e a cauda aprovadas; somente as partes inferiores são substituídas. Prompt em docs/capitio-corpo-espectral-prompt.txt. Compilação e 14 testes aprovados, incluindo atualização do teste para apenas duas patas dianteiras. Aparência conferida no cenário, onboarding e diálogo.

## Correção de montagem e altura da cauda

A cauda foi baixada junto ao torso no renderer compartilhado pelo onboarding, retratos e cenário, preservando o contorno aprovado. O corpo agora é uma composição contínua: foram removidos os recortes em faixas e as rotações independentes das patinhas que fragmentavam a silhueta. Cabeça e parte inferior são reunidas em uma superfície intermediária; o brilho é aplicado uma única vez ao personagem completo. Permanecem a flutuação, o balanço da cauda, a piscada e a expressão de descoberta. Esta descrição substitui a animação segmentada descrita acima. Não houve geração de nova arte nem alteração nas regras de investigação. Compilação aprovada e aparência conferida no navegador, no onboarding e no cenário.


### Recortes sem resíduos de poses vizinhas
O atlas pintado ultrapassa a divisão nominal em quatro células. A montagem agora exclui a margem superior da cauda e da cabeça feliz que continha resíduos das patas da pose anterior, sem mudar a escala, a posição ou o desenho da cauda. Correção compartilhada pelo cenário e pelos retratos. Build aprovado; poses normal e feliz conferidas no navegador.


### Corpo e cabeça em uma única pose
A composição anterior misturava a cabeça autoral com o torso de outra pintura, criando uma emenda visível abaixo da coleira. O renderer agora usa cada pose completa do atlas espectral existente (normal, piscando e feliz), sem cortar cabeça e torso. A cauda continua vindo da camada autoral, na posição aprovada. Esta decisão substitui as descrições anteriores de composição das duas pinturas. Build aprovado e visual conferido no modal e no cenário.


## Revisão do fluxo de conclusão
A quarta descoberta oferece acesso direto ao campo de resposta. Erros são associados ao campo, preservam pistas e desaparecem ao editar. O caderno identifica o caso encerrado. Verificação manual do onboarding ao reinício, com primeira pista no cenário e demais pela lista acessível; build e 14 testes aprovados. Relatório em ../revisao-primeira-partida.md. Pesquisa com jogadores e teste em celular físico continuam pendentes.

