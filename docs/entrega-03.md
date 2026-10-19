# Entrega 0.3 — Biblioteca, protagonista e onboarding

## Experiência

O guia de três passos aparece antes da primeira exploração: objetivo e regras; flutuação e freio; investigação e caderno. Permite voltar, avançar, pular ou usar Esc. Como jogar reabre a ajuda durante a partida, pausando movimento e preservando pistas. Conteúdo local em src/onboarding.ts. Diálogos usam foco contido pelo elemento nativo dialog, títulos nomeados e retorno de foco.

As regras explicadas correspondem à implementação: sem cronômetro, movimento contínuo até frear, colisão na base dos móveis, quatro pistas em qualquer ordem, revisão sem duplicação, resposta liberada apenas depois das quatro descobertas, erro sem perda de pistas. Recarregar a página reinicia a partida. Setas e WASD movem; espaço freia. Botões de direção e exploração por lista oferecem alternativas.

## Recursos de arte

Fontes originais em src/assets/game/:

- library-v1.png: fundo ilustrado, câmera fixa elevada, piso amplo livre, sem objetos de investigação embutidos.
- capitio-v1.png: personagem isolado com transparência, preservando silhueta canina, coleira vermelha e brilho lavanda.
- props-v1.png: atlas transparente com cadeira, estante com vaso, luminária e escudo entre espadas, em quatro regiões independentes.

Criados com a ferramenta integrada de geração de imagens. Prompts completos em art-prompts-v1.txt. As pranchas antigas foram usadas apenas como referências; não foram publicadas dentro do jogo.

O renderer seleciona as regiões do atlas sem editar os arquivos. Cenário, objetos e personagem são desenhados em camadas. Os móveis usam a posição da base para ordenar sobreposições; quando escondem o personagem, ficam parcialmente transparentes. Áreas de colisão ficam nos dados de cada objeto em investigation.ts. Colisões são aproximações retangulares na base, verificadas contra o raio dos pés do personagem; não uma máscara de cada pixel. O escudo é um elemento de parede e não bloqueia o piso.

## Apresentação

Área de jogo com proporção 8:5, cabeçalho compacto e caderno lateral; em telas estreitas, o caderno vai para baixo. Textos de interface são HTML em tamanho legível. Nomes dos objetos ficam na barra contextual somente quando próximos; indicador visual muda para visto ao revisitar. Não há rótulos permanentes flutuando sobre todos os móveis.

Botões e painel de pista reutilizam o kit existente, sem novas gerações de ornamentos. Texturas permanecem nos recursos ilustrados; controles auxiliares usam estilos simples. O foco de teclado fica visível.

Flutuação, leve inclinação, espelhamento de direção, rastro espectral, partículas ambientais e luzes suaves são calculados no Canvas. A preferência do sistema por movimento reduzido desliga as animações e transições. O personagem usa uma pose ilustrada com movimento procedural; ainda não tem animações próprias de orelhas/rabo nem vistas desenhadas para cada direção.

## Verificações

- Compilação TypeScript e build de produção aprovados.
- Nove testes automáticos: velocidade, bordas, colisão, acesso às quatro regiões, pausa, proximidade, pistas sem duplicação, condições da resposta, vitória e reinício.
- Navegador: três passos do guia, voltar/pular, abertura da ajuda com pistas preservadas, aproximação física da cadeira, indicador contextual, investigação por botão, quatro pistas pela lista, resposta incorreta, resposta correta e conclusão.
- Apresentação verificada na largura disponível do navegador. O CSS contém adaptações para telas menores; testes em aparelhos móveis e com leitores de tela reais continuam pendentes.

## Próxima revisão

Testar a orientação espacial e a sensação de flutuação com a autora. Refinar alinhamento das bases e colisões a partir desse uso. Otimizar o peso dos PNGs para publicação web e revisar franjas nas bordas. Não foi criada história nova, mecânica extra ou novo desfecho nesta entrega. Ainda não há publicação pública ou salvamento entre sessões.
