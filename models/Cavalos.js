const imgCavalo1 = new Image()
imgCavalo1.src = './img/cavalo_01bg.png'

const imgCavalo2 = new Image()
imgCavalo2.src = './img/cavaloAmigo_01bg.png'

const imgInimigo = new Image()
imgInimigo.src = './img/cavaloInimigo_01bg.png'

// Backgrounds por fase
const imgBg = [null, new Image(), new Image(), new Image()]
imgBg[1].src = './img/bg1.jpg'
imgBg[2].src = './img/bg2.jpg'
imgBg[3].src = './img/bg3.jpg'

// ---------- ÁUDIO ----------
const somGalopar = new Audio('/sons/galopar.mp3')
somGalopar.loop   = true
somGalopar.volume = 0.6

const somDerrota = new Audio('/sons/failure.mp3')
somDerrota.volume = 0.3

// ---------- CONSTANTES DE PISTA ----------
const MEIO      = 310
const TOPO      = 62
const FUNDO     = 550
const RAIA1_MIN = TOPO
const RAIA1_MAX = MEIO - 60
const RAIA2_MIN = MEIO + 40
const RAIA2_MAX = FUNDO

//  CLASSE BASE

class Obj {
    constructor(x, y, w, h, img) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.img = img
    }

    des_cavalo() {
        des.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
}

//  JOGADOR

class Cavalo extends Obj {
    constructor(x, y, w, h, img, yMin, yMax) {
        super(x, y, w, h, img)
        this.yMin   = yMin
        this.yMax   = yMax
        this.dir    = 0
        this.vida   = 5
        this.pontos = 0
    }

    mov_cavalo() {
        this.y += this.dir
    
        if (this.y < this.yMin) {
            this.y = this.yMin
        }
    
        if (this.y + this.h > this.yMax) {
            this.y = this.yMax - this.h
        }
    }
    colid(objeto) {
        return (this.x < objeto.x + objeto.w) &&
               (this.x + this.w > objeto.x)   &&
               (this.y < objeto.y + objeto.h)  &&
               (this.y + this.h > objeto.y)
    }
}

//  INIMIGO

class CavaloInimigo extends Obj {
    constructor(x, y, w, h, img, yMin, yMax) {
        super(x, y, w, h, img)
        this.yMin = yMin
        this.yMax = yMax
        this.vel  = 5
    }

    recomeca() {
        this.x = 1300 + Math.random() * 400
        this.y = Math.floor(Math.random() * (this.yMax - this.yMin) + this.yMin)
    }

    mov_cavalo() {
        this.x -= this.vel
    }
}

//  COLETÁVEL

class Coletavel {
    constructor(x, y) {
        this.x     = x
        this.y     = y
        this.r     = 14
        this.tipo  = Math.random() < 0.5 ? 'ponto' : 'vida'
        this.ativo = true
    }

    reset() {
        this.x     = 1250 + Math.random() * 600
        this.y     = TOPO + 20 + Math.random() * (FUNDO - TOPO - 40)
        this.tipo  = Math.random() < 0.5 ? 'ponto' : 'vida'
        this.ativo = true
    }

    mover() {
        this.x -= 2.5
        if (this.x < -20) this.reset()
    }

    desenhar() {
        if (!this.ativo) return
        des.save()
        des.shadowBlur   = 14
        des.shadowColor  = this.tipo === 'ponto' ? '#ffe066' : '#66ffaa'
        des.fillStyle    = this.tipo === 'ponto' ? '#f5c842' : '#2ecc71'
        des.beginPath()
        des.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        des.fill()
        des.fillStyle    = '#1a0a00'
        des.font         = 'bold 13px Arial'
        des.textAlign    = 'center'
        des.textBaseline = 'middle'
        des.fillText(this.tipo === 'ponto' ? '★' : '♥', this.x, this.y)
        des.restore()
        des.textAlign    = 'left'
        des.textBaseline = 'alphabetic'
    }

    tocou(cavalo) {
        const dx = cavalo.x + cavalo.w / 2 - this.x
        const dy = cavalo.y + cavalo.h / 2 - this.y
        return Math.sqrt(dx * dx + dy * dy) < this.r + 30
    }
}

//  TEXTO

class Text {
    des_text(text, x, y, cor, font) {
        des.fillStyle = cor
        des.font      = font
        des.fillText(text, x, y)
    }
}