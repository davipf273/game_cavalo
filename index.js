let des = document.getElementById('des').getContext('2d')

// inimigos da raia 1 (P1)
let carroInimigo = new CarroInimigo(1300, 150, 150, 60, imgInimigo, RAIA1_MIN, RAIA1_MAX)
let carroInimigo2 = new CarroInimigo(1700, 200, 150, 60, imgInimigo, RAIA1_MIN, RAIA1_MAX)

// inimigos da raia 2 (P2)
let carroInimigo3 = new CarroInimigo(1500, 420, 150, 60, imgInimigo, RAIA2_MIN, RAIA2_MAX)
let carroInimigo4 = new CarroInimigo(1900, 470, 150, 60, imgInimigo, RAIA2_MIN, RAIA2_MAX)

// jogadores
let carro = new Carro(100, 150, 150, 60, imgCavalo1, RAIA1_MIN, RAIA1_MAX)
let carro2 = new Carro(100, 430, 150, 60, imgCavalo2, RAIA2_MIN, RAIA2_MAX)

let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

let jogar = true
let fase = 1

// ---- CONTROLES ----
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        carro.dir = -10
    }
    if (e.key === 's') {
        carro.dir = 10
    }
    if (e.key === 'ArrowUp') {
        carro2.dir = -10
        e.preventDefault()
    }
    if (e.key === 'ArrowDown') {
        carro2.dir = 10
        e.preventDefault()
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') {
        carro.dir = 0
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        carro2.dir = 0
    }
})

// ---- COLISÃO ----
function colisao() {
    if (carro.colid(carroInimigo)) {
        carroInimigo.recomeca()
        carro.vida -= 1
    }
    if (carro.colid(carroInimigo2)) {
        carroInimigo2.recomeca()
        carro.vida -= 1
    }

    if (carro2.colid(carroInimigo3)) {
        carroInimigo3.recomeca()
        carro2.vida -= 1

    }
    if (carro2.colid(carroInimigo4)) {
        carroInimigo4.recomeca()
        carro2.vida -= 1
    }
}

// ---- PONTUAÇÃO ----
function pontuacao() {
    // P1
    if (carroInimigo.x <= -100) {
        carro.pontos += 5; carroInimigo.recomeca()
    }
    if (carroInimigo2.x <= -100) {
        carro.pontos += 5; carroInimigo2.recomeca()
    }

    // P2
    if (carroInimigo3.x <= -100) {
        carro2.pontos += 5; carroInimigo3.recomeca()
    }
    if (carroInimigo4.x <= -100) {
        carro2.pontos += 5; carroInimigo4.recomeca()
    }
}

// ---- FASES ----
function ver_fase() {
    const top = Math.max(carro.pontos, carro2.pontos)
    if (top > 20 && fase === 1) {
        fase = 2
        carroInimigo.vel = carroInimigo2.vel = carroInimigo3.vel = carroInimigo4.vel = 4
    } else if (top > 40 && fase === 2) {
        fase = 3
        carroInimigo.vel = carroInimigo2.vel = carroInimigo3.vel = carroInimigo4.vel = 6
    }
}

// ---- GAME OVER ----
function game_over() {
    if (carro.vida <= 0 || carro2.vida <= 0) jogar = false
}

// ---- LINHA DO MEIO ----
function desenhaLinhaMeio() {
    des.save()
    des.setLineDash([20, 15])
    des.lineWidth = 3
    des.strokeStyle = 'rgba(255,255,255,0.4)'
    des.beginPath()
    des.moveTo(0, MEIO)
    des.lineTo(1200, MEIO)
    des.stroke()
    des.setLineDash([])
    des.restore()
}

// ---- DESENHA ----
function desenha() {
    if (jogar) {
        carroInimigo.des_carro()
        carroInimigo2.des_carro()
        carroInimigo3.des_carro()
        carroInimigo4.des_carro()
        carro.des_carro()
        carro2.des_carro()
        desenhaLinhaMeio()
        t1.des_text('J1 Vidas: ' + carro.vida, 900, 40, 'red', '22px Arial')
        t1.des_text('J1 Pontos: ' + carro.pontos, 900, 70, 'yellow', '22px Arial')
        t1.des_text('J2 Vidas: ' + carro2.vida, 40, 40, 'red', '22px Arial')
        t1.des_text('J2 Pontos: ' + carro2.pontos, 40, 70, 'yellow', '22px Arial')
        fase_txt.des_text('Fase: ' + fase, 540, 40, 'white', '26px Arial')
    } else {
        t1.des_text('GAME OVER', 420, 300, 'yellow', '60px Arial')
        const vencedor = carro.vida <= 0 ? 'J2 Venceu!' : 'J1 Venceu!'
        t1.des_text(vencedor, 480, 360, '#fff', '30px Arial')
        t1.des_text('J1: ' + carro.pontos + ' pts', 430, 420, 'yellow', '26px Arial')
        t1.des_text('J2: ' + carro2.pontos + ' pts', 430, 460, '#4af', '26px Arial')
    }
}

// ---- ATUALIZA ----
function atualiza() {
    if (jogar) {
        carro.mov_car()
        carro2.mov_car()
        carroInimigo.mov_car()
        carroInimigo2.mov_car()
        carroInimigo3.mov_car()
        carroInimigo4.mov_car()
        colisao()
        pontuacao()
        ver_fase()
        game_over()
    }
}

// ---- LOOP ----
function main() {
    des.clearRect(0, 0, 1200, 700)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

main()