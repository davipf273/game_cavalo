const imgCavalo1 = new Image()
imgCavalo1.src = './img/cavalo_01bg.png'

const imgCavalo2 = new Image()
imgCavalo2.src = './img/cavaloAmigo_01bg.png'

const imgInimigo = new Image()
imgInimigo.src = './img/cavaloInimigo_01bg.png'

const MEIO = 310
const TOPO = 62
const FUNDO = 550
const RAIA1_MIN = TOPO
const RAIA1_MAX = MEIO - 60 
const RAIA2_MIN = MEIO + 40 
const RAIA2_MAX = FUNDO

class Obj {
    constructor(x, y, w, h, img) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.img = img
    }

    des_carro() {
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
}

class Carro extends Obj {
    constructor(x, y, w, h, img, yMin, yMax) {
        super(x, y, w, h, img)
        this.yMin = yMin
        this.yMax = yMax
        this.dir = 0
        this.vida = 5
        this.pontos = 0
    }

    mov_car() {
        this.y += this.dir
        if (this.y < this.yMin) this.y = this.yMin
        if (this.y > this.yMax) this.y = this.yMax
    }

    colid(objeto) {
        return (this.x < objeto.x + objeto.w) &&
            (this.x + this.w > objeto.x) &&
            (this.y < objeto.y + objeto.h) &&
            (this.y + this.h > objeto.y)
    }
}

class CarroInimigo extends Obj {
    constructor(x, y, w, h, img, yMin, yMax) {
        super(x, y, w, h, img)
        this.yMin = yMin
        this.yMax = yMax
        this.vel = 2
    }

    recomeca() {
        this.x = 1300 + Math.random() * 400
        this.y = Math.floor(Math.random() * (this.yMax - this.yMin) + this.yMin)
    }


    mov_car() {
        this.x -= this.vel
    }
}

class Text {
    des_text(text, x, y, cor, font) {
        des.fillStyle = cor
        des.font = font
        des.fillText(text, x, y)
    }
}
