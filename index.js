let des = document.getElementById('des').getContext('2d')

let carroInimigo = new CarroInimigo(1300, 325, 150, 60, './img/cavaloInimigo_01bg.png')
let carroInimigo2 = new CarroInimigo(1500, 125, 150, 60, './img/cavaloInimigo_01bg.png')
let carroInimigo3 = new CarroInimigo(1700, 400, 150, 60, './img/cavaloInimigo_01bg.png')
let carro = new Carro(100, 125, 150, 60, './img/cavalo_01bg.png')
let carro2 = new Carro(100, 450, 150, 60, './img/cavalo_01bg.png')
// let medidaCarro = new Carro(100, 325, 85, 50, 'green')

let t1 = new Text()
let t2 = new Text()
let fase_txt = new Text()

let jogar = true
let fase = 1

document.addEventListener('keydown', (e) => {
    if (e.key === 'w' ) {
        carro.dir = -10
    } else if (e.key === 's') {
        carro.dir = 10
    }
}) 

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' ) {
        carro.dir = 0
    } else if (e.key === 's' ) {
        carro.dir = 0
    }
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        carro2.dir = 0
    } else if (e.key === 'ArrowDown') {
        carro2.dir = 0
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        carro2.dir = -10
    } else if (e.key === 'ArrowDown') {
        carro2.dir = 10
    }
})

function game_over() {
    if (carro.vida <= 0) {
        jogar = false
    }
}

function ver_fase() { 
    if (carro.pontos > 20 && fase === 1) {
        fase = 2
        carroInimigo.vel = 4
        carroInimigo2.vel = 4
        carroInimigo3.vel = 4
    } else if (carro.pontos > 40 && fase === 2) {
        fase = 3
        carroInimigo.vel = 6
        carroInimigo2.vel = 6
        carroInimigo3.vel = 6
    }
}

function colisao() {
    if (carro.colid(carroInimigo)) {
        carroInimigo.recomeca()
        carro.vida -= 1
    }
    if (carro.colid(carroInimigo2)) {

        carroInimigo2.recomeca()
        carro.vida -= 1
    }
    if (carro.colid(carroInimigo3)) {
        carroInimigo3.recomeca()
        carro.vida -= 1
    }
    if (carro2.colid(carroInimigo)) {
        carroInimigo.recomeca()
        carro2.vida -= 1
    }
    if (carro2.colid(carroInimigo2)) {

        carroInimigo2.recomeca()
        carro2.vida -= 1
    }
    if (carro2.colid(carroInimigo3)) {
        carroInimigo3.recomeca()
        carro2.vida -= 1
    }
    console.log('vida: ', carro.vida)
    console.log('vida2: ', carro2.vida)
}

function pontuacao() {
    if (carro.point(carroInimigo)) {
        carro.pontos += 5
        carroInimigo.recomeca()
    }
    if (carro.point(carroInimigo2)) {
        carro.pontos += 5
        carroInimigo2.recomeca()
    }
    if (carro.point(carroInimigo3)) {
        carro.pontos += 5
        carroInimigo3.recomeca()
    }
    if (carro2.point(carroInimigo)) {
        carro2.pontos += 5
        carroInimigo.recomeca()
    }
    if (carro2.point(carroInimigo2)) {
        carro2.pontos += 5
        carroInimigo2.recomeca()
    }
    if (carro2.point(carroInimigo3)) {
        carro2.pontos += 5
        carroInimigo3.recomeca()
    }
}

function desenha() {

    if (jogar) {
        carroInimigo.des_carro()
        carroInimigo2.des_carro()
        carroInimigo3.des_carro()
        carro.des_carro()
        carro2.des_carro()
        t2.des_text('J1 Vidas: ' + carro.vida, 1000, 40, 'red', '26px Arial')
        t1.des_text('J1 Pontos: ' + carro.pontos, 1000, 70, 'yellow', '26px Arial')
        t2.des_text('J2 Vidas: ' + carro2.vida, 40, 40 , 'red', '26px Arial')
        t1.des_text('J2 Pontos: ' + carro2.pontos, 40, 70,'yellow', '26px Arial')
        fase_txt.des_text('Fase: ' + fase, 550, 40, 'white', '26px Arial')
    }else{
        t1.des_text('GAME OVER', 450, 350, 'yellow', '60px Arial')
        t2.des_text('Pontuação Final: ' + carro.pontos, 480, 400, 'white', '25px Arial')
        t2.des_text('Pontuação Final: ' + carro2.pontos, 480, 40, 'white', '25px Arial')
    }

}

function atualiza() {
    if (jogar) {
        carro.mov_car()
        carro2.mov_car()
        // carro.anim('cavalo_00')
        carroInimigo.mov_car()
        carroInimigo2.mov_car()
        carroInimigo3.mov_car()
        colisao()
        pontuacao()
        ver_fase()
        game_over()
    }
}

function main() {
    des.clearRect(0, 0, 1200, 700)
    desenha()
    atualiza()
    requestAnimationFrame(main)
}

main()