let des = document.getElementById('des').getContext('2d')

// ---------- ESTADO GLOBAL ----------
let tela  = 'menu'  
let jogar = true
let fase  = 1

// ---------- INSTÂNCIAS (inicializadas em criarJogo) ----------
let cavalo, cavalo2
let cavaloInimigo, cavaloInimigo2, cavaloInimigo3, cavaloInimigo4
let coletaveis
let t1, fase_txt


//  INICIALIZA / REINICIA JOGO


function criarJogo() {
    fase  = 1
    jogar = true

    // jogadores
    cavalo  = new Cavalo(100, 150, 150, 60, imgCavalo1, RAIA1_MIN, RAIA1_MAX)
    cavalo2 = new Cavalo(100, 430, 150, 60, imgCavalo2, RAIA2_MIN, RAIA2_MAX)

    //inimigos (vel aumenta por fase)
    cavaloInimigo  = new CavaloInimigo(1300, 150, 150, 60, imgInimigo, RAIA1_MIN, RAIA1_MAX)
    cavaloInimigo2 = new CavaloInimigo(1700, 200, 150, 60, imgInimigo, RAIA1_MIN, RAIA1_MAX)
    cavaloInimigo3 = new CavaloInimigo(1500, 420, 150, 60, imgInimigo, RAIA2_MIN, RAIA2_MAX)
    cavaloInimigo4 = new CavaloInimigo(1900, 470, 150, 60, imgInimigo, RAIA2_MIN, RAIA2_MAX)

    // coletaveis
    coletaveis = [
        new Coletavel(900,  180),
        new Coletavel(1100, 460),
        new Coletavel(1400, 300),
    ]

    t1       = new Text()
    fase_txt = new Text()
}

//  CONTROLES  

document.addEventListener('keydown', (e) => {

    // Navegação entre telas
    if (tela === 'menu') {
        if (e.key === 'Enter')              iniciarJogo()
        if (e.key === 'm' || e.key === 'M') tela = 'manual'
        if (e.key === 'F1')                 tela = 'sobre'
    }
    if (tela === 'manual' || tela === 'sobre') {
        if (e.key === 'Escape') tela = 'menu'
    }
    if ((tela === 'vitoria' || tela === 'derrota') && e.key === 'Enter') iniciarJogo()
    if (tela === 'jogo' && e.key === 'Escape') tela = 'menu'

    // Movimentação — jogo ativo
    if (tela === 'jogo') {
        if (e.key === 'w')         cavalo.dir  = -10
        if (e.key === 's')         cavalo.dir  =  10
        if (e.key === 'ArrowUp')   { cavalo2.dir = -10; e.preventDefault() }
        if (e.key === 'ArrowDown') { cavalo2.dir =  10; e.preventDefault() }
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's')
        if (cavalo) cavalo.dir = 0
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        if (cavalo2) cavalo2.dir = 0
})


//  LOGICA DO JOGO


// colisao com inimigo -> perde vida
function colisao() {
    if (cavalo.colid(cavaloInimigo))  { cavaloInimigo.recomeca();  cavalo.vida  -= 1 }
    if (cavalo.colid(cavaloInimigo2)) { cavaloInimigo2.recomeca(); cavalo.vida  -= 1 }
    if (cavalo2.colid(cavaloInimigo3)){ cavaloInimigo3.recomeca(); cavalo2.vida -= 1 }
    if (cavalo2.colid(cavaloInimigo4)){ cavaloInimigo4.recomeca(); cavalo2.vida -= 1 }
}

// coleta item -> soma pontos ou recupera vida
function checarColetaveis() {
    coletaveis.forEach(col => {
        if (!col.ativo) return
        ;[cavalo, cavalo2].forEach(c => {
            if (col.tocou(c)) {
                if (col.tipo === 'ponto') c.pontos += 10
                else                      c.vida = Math.min(c.vida + 1, 5)
                col.ativo = false
                setTimeout(() => col.reset(), 2000)
            }
        })
    })
}

// inimigo passou sem colidir -> +5 pontos
function pontuacao() {
    if (cavaloInimigo.x  <= -100) { cavalo.pontos  += 5; cavaloInimigo.recomeca()  }
    if (cavaloInimigo2.x <= -100) { cavalo.pontos  += 5; cavaloInimigo2.recomeca() }
    if (cavaloInimigo3.x <= -100) { cavalo2.pontos += 5; cavaloInimigo3.recomeca() }
    if (cavaloInimigo4.x <= -100) { cavalo2.pontos += 5; cavaloInimigo4.recomeca() }
}

// progressao de fases 
function ver_fase() {
    const top = Math.max(cavalo.pontos, cavalo2.pontos)
    if (top >= 30 && fase === 1) {
        fase = 2
        cavaloInimigo.vel = cavaloInimigo2.vel = cavaloInimigo3.vel = cavaloInimigo4.vel = 4
    } else if (top >= 60 && fase === 2) {
        fase = 3
        cavaloInimigo.vel = cavaloInimigo2.vel = cavaloInimigo3.vel = cavaloInimigo4.vel = 6
    }
}

// vitoria: fase 3 + ambos com vida > 0 + pontos >= 90
function checarVitoria() {
    if (fase === 3
        && cavalo.pontos  >= 90 && cavalo2.pontos >= 90
        && cavalo.vida > 0 && cavalo2.vida > 0) {
        jogar = false
        tela  = 'vitoria'
    }
}

// game over: qualquer jogador com 0 vidas -> tela de derrota
function game_over() {
    if (cavalo.vida <= 0 || cavalo2.vida <= 0) {
        jogar = false
        tela  = 'derrota'
    }
}


//  RENDER — TELA DE JOGO


// fundo diferente por fase (com fallback gradiente)
function desenhaFundo() {
    const bg = imgBg[fase]
    if (bg && bg.complete && bg.naturalWidth > 0) {
        const off = (Date.now() / 8) % 1200
        des.drawImage(bg, -off,       0, 1200, 700)
        des.drawImage(bg, 1200 - off, 0, 1200, 700)
    } else {
        const cores = [null,
            ['#1a3a1a', '#2e6e2e'],
            ['#1a2a4a', '#2a4a8a'],
            ['#4a1a1a', '#8a2a2a'],
        ]
        const grd = des.createLinearGradient(0, 0, 1200, 0)
        grd.addColorStop(0, cores[fase][0])
        grd.addColorStop(1, cores[fase][1])
        des.fillStyle = grd
        des.fillRect(0, 0, 1200, 700)
    }
}

function desenhaLinhaMeio() {
    des.save()
    des.setLineDash([20, 15])
    des.lineWidth   = 3
    des.strokeStyle = 'rgba(255,255,255,0.4)'
    des.beginPath()
    des.moveTo(0, MEIO)
    des.lineTo(1200, MEIO)
    des.stroke()
    des.setLineDash([])
    des.restore()
}

// barras de vida no HUD
function desenhaVidas(vida, x, y, cor) {
    for (let i = 0; i < 5; i++) {
        des.fillStyle = i < vida ? cor : 'rgba(255,255,255,0.15)'
        des.fillRect(x + i * 24, y, 18, 18)
    }
}

// HUD com pontos, vidas e fase
function desenhaHUD() {
    desenhaVidas(cavalo.vida,  900, 15, '#f04')
    t1.des_text('J1 Pontos: ' + cavalo.pontos,  900, 60, 'yellow', '22px Arial')

    desenhaVidas(cavalo2.vida, 20, 15, '#4af')
    t1.des_text('J2 Pontos: ' + cavalo2.pontos, 20,  60, 'yellow', '22px Arial')

    fase_txt.des_text('Fase: ' + fase, 540, 40, 'white', '26px Arial')

    // barra de progresso de fase
    const meta = fase === 1 ? 30 : fase === 2 ? 60 : 90
    const prog = Math.min(Math.max(cavalo.pontos, cavalo2.pontos) / meta, 1)
    des.fillStyle = 'rgba(0,0,0,0.5)'
    des.fillRect(440, 48, 320, 10)
    des.fillStyle = prog >= 1 ? '#2ecc71' : '#f5c842'
    des.fillRect(440, 48, 320 * prog, 10)
}

function desenha() {
    if (jogar) {
        desenhaFundo()
        coletaveis.forEach(c => c.desenhar())
        cavaloInimigo.des_cavalo()
        cavaloInimigo2.des_cavalo()
        cavaloInimigo3.des_cavalo()
        cavaloInimigo4.des_cavalo()
        cavalo.des_cavalo()
        cavalo2.des_cavalo()
        desenhaLinhaMeio()
        desenhaHUD()
    }
}

function atualiza() {
    if (jogar) {
        cavalo.mov_cavalo()
        cavalo2.mov_cavalo()
        cavaloInimigo.mov_cavalo()
        cavaloInimigo2.mov_cavalo()
        cavaloInimigo3.mov_cavalo()
        cavaloInimigo4.mov_cavalo()
        coletaveis.forEach(c => c.mover())
        colisao()
        checarColetaveis()
        pontuacao()
        ver_fase()
        game_over()
        checarVitoria()
    }
}


//  TELAS ESTATICAS  

// utilitarios canvas
function fillBox(x, y, w, h, r, fill) {
    des.fillStyle = fill
    des.beginPath(); des.roundRect(x, y, w, h, r); des.fill()
}
function strokeBox(x, y, w, h, r, cor, lw) {
    des.strokeStyle = cor; des.lineWidth = lw
    des.beginPath(); des.roundRect(x, y, w, h, r); des.stroke()
}
function textCenter(txt, y, cor, font) {
    des.fillStyle = cor; des.font = font
    des.textAlign = 'center'; des.fillText(txt, 600, y)
    des.textAlign = 'left'
}

// ----- Menu Inicial -----
let menuHover = -1

const MENU_BTNS = [
    { label: '🏇  JOGAR'  },
    { label: '📖  MANUAL' },
    { label: 'ℹ️   SOBRE'  },
]
const BX = 400, BW = 400, BH = 56, BGAP = 74

function desenhaMenu() {
    const grd = des.createLinearGradient(0, 0, 0, 700)
    grd.addColorStop(0, '#0d0420'); grd.addColorStop(1, '#1a0635')
    des.fillStyle = grd; des.fillRect(0, 0, 1200, 700)

    des.fillStyle = 'rgba(255,255,255,0.15)'
    for (let i = 0; i < 60; i++) {
        des.beginPath()
        des.arc((i * 137.5) % 1200, (i * 89.3) % 700, 1.2, 0, Math.PI * 2)
        des.fill()
    }

    des.shadowBlur = 40; des.shadowColor = '#9e42f5'
    textCenter('🏇 HORSE DASH', 130, '#d5f522', "bold 72px 'Rye', cursive")
    des.shadowBlur = 0
    textCenter('corrida de cavalos — 2 jogadores', 170, 'rgba(255,255,255,0.5)', '18px Arial')

    MENU_BTNS.forEach((btn, i) => {
        const by    = 230 + i * BGAP
        const hover = menuHover === i
        fillBox(BX, by, BW, BH, 8, hover ? 'rgba(245,200,66,0.25)' : 'rgba(255,255,255,0.06)')
        strokeBox(BX, by, BW, BH, 8, hover ? '#f5c842' : 'rgba(255,255,255,0.2)', 2)
        des.fillStyle = hover ? '#f5c842' : '#fff'
        des.font = '22px Arial'
        des.textAlign = 'center'
        des.fillText(btn.label, BX + BW / 2, by + BH / 2 + 8)
        des.textAlign = 'left'
    })

    textCenter('ENTER jogar  •  M manual  •  F1 sobre', 660, 'rgba(255,255,255,0.3)', '16px Arial')
}

const canvas = document.getElementById('des')

canvas.addEventListener('mousemove', (e) => {
    if (tela !== 'menu') return
    const rect = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (1200 / rect.width)
    const my = (e.clientY - rect.top)  * (700  / rect.height)
    menuHover = -1
    MENU_BTNS.forEach((_, i) => {
        const by = 230 + i * BGAP
        if (mx >= BX && mx <= BX + BW && my >= by && my <= by + BH) menuHover = i
    })
})

canvas.addEventListener('click', () => {
    if (tela === 'menu') {
        if (menuHover === 0) iniciarJogo()
        if (menuHover === 1) tela = 'manual'
        if (menuHover === 2) tela = 'sobre'
    }
    if (tela === 'manual' || tela === 'sobre') tela = 'menu'
    if (tela === 'vitoria' || tela === 'derrota') iniciarJogo()
})

function iniciarJogo() { criarJogo(); tela = 'jogo' }

// ----- Manual -----
function desenhaManual() {
    const grd = des.createLinearGradient(0, 0, 0, 700)
    grd.addColorStop(0, '#0d0420'); grd.addColorStop(1, '#180530')
    des.fillStyle = grd; des.fillRect(0, 0, 1200, 700)

    fillBox(60, 30, 1080, 640, 14, 'rgba(255,255,255,0.04)')
    strokeBox(60, 30, 1080, 640, 14, 'rgba(245,200,66,0.3)', 2)
    textCenter('📖  MANUAL DE INSTRUÇÕES', 100, '#f5c842', "bold 36px 'Rye', cursive")

    const c1 = 120, c2 = 650

    let y = 150
    des.fillStyle = '#9e42f5'; des.font = 'bold 20px Arial'
    des.fillText('JOGADOR 1', c1, y); y += 30
    ;['W — mover para cima', 'S — mover para baixo'].forEach(t => {
        des.fillStyle = '#fff'; des.font = '18px Arial'
        des.fillText('▸ ' + t, c1, y); y += 28
    })
    y += 20
    des.fillStyle = '#4af'; des.font = 'bold 20px Arial'
    des.fillText('JOGADOR 2', c1, y); y += 30
    ;['↑ — mover para cima', '↓ — mover para baixo'].forEach(t => {
        des.fillStyle = '#fff'; des.font = '18px Arial'
        des.fillText('▸ ' + t, c1, y); y += 28
    })
    y += 20
    des.fillStyle = 'rgba(255,255,255,0.5)'; des.font = '16px Arial'
    des.fillText('ESC — voltar ao menu', c1, y)

    let y2 = 150
    des.fillStyle = '#d5f522'; des.font = 'bold 20px Arial'
    des.fillText('PONTUAÇÃO', c2, y2); y2 += 30
    ;[
        '+ 5 pts — inimigo passa sem colisão',
        '+10 pts — coletar ★ (estrela amarela)',
        '− 1 vida  — colidir com inimigo',
        '+ 1 vida  — coletar ♥ (coração verde)',
    ].forEach(t => {
        des.fillStyle = '#fff'; des.font = '18px Arial'
        des.fillText('▸ ' + t, c2, y2); y2 += 30
    })
    y2 += 20
    des.fillStyle = '#d5f522'; des.font = 'bold 20px Arial'
    des.fillText('FASES', c2, y2); y2 += 30
    ;[
        'Fase 1 → 30 pts   vel. inimigos: 2',
        'Fase 2 → 60 pts   vel. inimigos: 4',
        'Fase 3 → 90 pts   vel. inimigos: 6',
        'Vitória: ambos ≥ 90 pts + vida > 0',
    ].forEach(t => {
        des.fillStyle = '#fff'; des.font = '18px Arial'
        des.fillText('▸ ' + t, c2, y2); y2 += 30
    })
    y2 += 20
    des.fillStyle = '#f04'; des.font = 'bold 20px Arial'
    des.fillText('GAME OVER', c2, y2); y2 += 30
    des.fillStyle = '#fff'; des.font = '18px Arial'
    des.fillText('▸ Qualquer jogador chegar a 0 vidas', c2, y2)

    textCenter('ESC ou clique para voltar ao menu', 660, 'rgba(255,255,255,0.4)', '16px Arial')
}

// ----- Sobre  -----
function desenhaSobre() {
    const grd = des.createLinearGradient(0, 0, 0, 700)
    grd.addColorStop(0, '#0d0420'); grd.addColorStop(1, '#200640')
    des.fillStyle = grd; des.fillRect(0, 0, 1200, 700)

    fillBox(200, 60, 800, 580, 18, 'rgba(158,66,245,0.08)')
    strokeBox(200, 60, 800, 580, 18, 'rgba(158,66,245,0.5)', 2)
    textCenter('ℹ️  SOBRE O JOGO', 140, '#9e42f5', "bold 40px 'Rye', cursive")

    const itens = [
        { label: '🎮  Título',               val: 'Horse Dash — Corrida de Cavalos'  },
        { label: '👨‍💻  Desenvolvedor',         val: 'Davi Pereira Fagundes'                  },
        { label: '🐙  GitHub',                val: 'https://github.com/davipf273/game_cavalo'          },
        { label: '🏫  Disciplina',            val: 'Programação Orientada a Objetos'  },
        { label: '🏛️  Instituição',           val: 'Sesi Senai'            },
        { label: '📅  Ano',                   val: new Date().getFullYear().toString()},
    ]

    let y = 200
    itens.forEach(item => {
        des.fillStyle = 'rgba(255,255,255,0.06)'
        des.fillRect(250, y - 22, 700, 34)
        des.fillStyle = '#f5c842'; des.font = 'bold 17px Arial'
        des.fillText(item.label, 270, y)
        des.fillStyle = '#fff'; des.font = '17px Arial'
        des.fillText(item.val, 550, y)
        y += 46
    })

    textCenter('ESC ou clique para voltar ao menu', 660, 'rgba(255,255,255,0.4)', '16px Arial')
}

// ----- Vitoria -----
let vitoriaT = 0

function desenhaVitoria() {
    vitoriaT += 0.02
    const grd = des.createLinearGradient(0, 0, 0, 700)
    grd.addColorStop(0, '#0a2a0a'); grd.addColorStop(1, '#0d0420')
    des.fillStyle = grd; des.fillRect(0, 0, 1200, 700)

    for (let i = 0; i < 40; i++) {
        des.fillStyle = ['#f5c842','#2ecc71','#9e42f5','#4af','#f04'][i % 5]
        des.fillRect(
            (i * 137.5 + vitoriaT * 30 * (i % 2 === 0 ? 1 : -1)) % 1200,
            (i * 89.3  + vitoriaT * 60) % 700,
            6, 6
        )
    }

    des.shadowBlur = 60; des.shadowColor = '#2ecc71'
    textCenter('🏆  VITÓRIA!', 250, '#d5f522', "bold 90px 'Rye', cursive")
    des.shadowBlur = 0
    textCenter('Ambos completaram as 3 fases!', 320, '#fff', '24px Arial')

    des.textAlign = 'center'
    des.fillStyle = '#f04'; des.font = 'bold 28px Arial'
    des.fillText('J1 — ' + cavalo.pontos  + ' pts  •  ' + cavalo.vida  + ' vidas', 600, 390)
    des.fillStyle = '#4af'
    des.fillText('J2 — ' + cavalo2.pontos + ' pts  •  ' + cavalo2.vida + ' vidas', 600, 430)
    des.textAlign = 'left'

    textCenter('ENTER ou clique para jogar novamente', 520, 'rgba(255,255,255,0.6)', '20px Arial')
}

// ----- Derrota  -----
let derrotaT = 0

function desenhaDerrota() {
    derrotaT += 0.02
    const grd = des.createLinearGradient(0, 0, 0, 700)
    grd.addColorStop(0, '#2a0000'); grd.addColorStop(1, '#0d0420')
    des.fillStyle = grd; des.fillRect(0, 0, 1200, 700)

    des.fillStyle = 'rgba(255,0,0,0.06)'
    des.fillRect(0, 300 + Math.sin(derrotaT * 10) * 20, 1200, 3)

    des.shadowBlur = 50; des.shadowColor = '#f00'
    textCenter('💀  GAME OVER', 250, '#ff3333', "bold 80px 'Rye', cursive")
    des.shadowBlur = 0

    const perdedor = cavalo.vida <= 0 ? 'J1 ficou sem vidas!' : 'J2 ficou sem vidas!'
    const vencedor = cavalo.vida <= 0 ? 'J2 Venceu!' : 'J1 Venceu!'
    textCenter(perdedor, 310, 'rgba(255,100,100,0.8)', '22px Arial')
    textCenter(vencedor, 360, '#f5c842', 'bold 36px Arial')

    des.textAlign = 'center'
    des.fillStyle = '#f04'; des.font = '24px Arial'
    des.fillText('J1: ' + cavalo.pontos  + ' pts', 600, 430)
    des.fillStyle = '#4af'
    des.fillText('J2: ' + cavalo2.pontos + ' pts', 600, 465)
    des.textAlign = 'left'

    textCenter('ENTER ou clique — jogar novamente  •  ESC — menu', 560, 'rgba(255,255,255,0.5)', '18px Arial')
}


//  LOOP PRINCIPAL  
function main() {
    des.clearRect(0, 0, 1200, 700)

    switch (tela) {
        case 'menu':    desenhaMenu();    break
        case 'manual':  desenhaManual();  break
        case 'sobre':   desenhaSobre();   break
        case 'vitoria': desenhaVitoria(); break
        case 'derrota': desenhaDerrota(); break
        case 'jogo':
            desenha()
            atualiza()
            break
    }

    requestAnimationFrame(main)
}

main()