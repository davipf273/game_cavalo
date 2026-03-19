class Obj{
    constructor(x,y,w,h,a){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.a = a  
    }

    des_carro(){
        let img = new Image()
        img.src = this.a
        des.drawImage(img, this.x, this.y, this.w, this.h)
    }

    des_quad(){
        des.fillStyle = this.a
        des.fillRect(this.x, this.y, this.w, this.h,this.a)
    }

}

class Carro extends Obj{

    dir = 0
    vida = 5
    pontos = 0
    frame = 1
    tempo = 0

    mov_car(){
        this.y += this.dir
        if(this.y < 62){
            this.y = 62
        }else if(this.y > 640){
            this.y = 400
        }
    }

    colid(objeto){
        if((this.x < objeto.x + objeto.w)&&
          (this.x + this.w > objeto.x)&&
          (this.y < objeto.y + objeto.h)&&
          (this.y + this.h > objeto.y)){
            return true
        }else{
            return false
        }
    }

    point(objeto){
        if(objeto.x <= -100){
            return true
        }else{
            return false
        }
    }

    anim(nome){
        this.tempo +=1
        if(this.tempo > 12){
            this.tempo = 0
            this.frame +=1
        }
        if(this.frame>2){
            this.frame=1
        }
        
        this.a = "./img/"+nome+this.frame+"bg.png"
    }


    
}

class CarroInimigo extends Obj{

    vel = 2

    recomeca(){
        this.x = 1300
        this.y =  Math.floor(Math.random() * (638 - 62) + 62)
    }

    mov_car(){
        this.x -= this.vel
        if(this.x <= - 200){            
            this.recomeca()         
        }
    }
}

class Estrada extends Obj{
    mov_est(){
        this.x -= 6
        if(this.x < - 60){
            this.x = 1300
        }        
    }
}

class Text{
    des_text(text,x,y,cor,font){
        des.fillStyle = cor
        des.lineWidth = '5'
        des.font = font
        des.fillText(text,x,y)
    }
}