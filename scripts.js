console.log("AUUU");

const sprites = new Image();
sprites.src = './rlksprite.png'; // Origem das imagens


const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const somHit = new Audio();
somHit.src = './efeitos/efeitos_hit.wav'

const chao = {
    spriteX: 500,
    spriteY: 270,
    largura: 450,
    altura: 222,
    x: 0,
    y: canvas.height - 132,

desenhar(){ // Função para mostrar o chão
    contexto.drawImage(
    sprites,
    chao.spriteX, chao.spriteY, // Sprite X, Sprite Y
    chao.largura, chao.altura, // Tamanho do recorte da Sprite
    chao.x, chao.y,
    chao.largura, chao.altura,
);
    contexto.drawImage(
    sprites,
    chao.spriteX, chao.spriteY, // Sprite X, Sprite Y
    chao.largura, chao.altura, // Tamanho do recorte da Sprite
    (chao.x + chao.largura), chao.y,
    chao.largura, chao.altura,
);
    }
}

function colisao(legendaryBird, chao){ // Função para calcular a colisão
    const birdY = legendaryBird.y + legendaryBird.altura;
    const chaoY = chao.y;

    if(birdY >= chaoY){
        return true;
    }
    return false;
}


const planoFundo = {
    spriteX: -5,
    spriteY: -240,
    largura: 450,
    altura: 1500,
    x: -10,
    y: canvas.height - 900,

desenhar(){ // Função para mostrar o plano de fundo
    contexto.fillStyle = '#B3D8D6';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
    sprites,
    planoFundo.spriteX, planoFundo.spriteY, // Sprite X, Sprite Y
    planoFundo.largura, planoFundo.altura, // Tamanho do recorte da Sprite
    planoFundo.x, planoFundo.y,
    planoFundo.largura, planoFundo.altura,
);
    contexto.drawImage(
    sprites,
    planoFundo.spriteX, planoFundo.spriteY, // Sprite X, Sprite Y
    planoFundo.largura, planoFundo.altura, // Tamanho do recorte da Sprite
    (planoFundo.x + planoFundo.largura), planoFundo.y,
    planoFundo.largura, planoFundo.altura,
);
    }
}


const telaInicio = {
    spriteX: 177,
    spriteY: 0,
    largura: 105,
    altura: 150,
    x: (canvas.width / 2) - 120 /2,
    y: 60,

desenhar(){ // Função para mostrar o chão
    contexto.drawImage(
    sprites,
    telaInicio.spriteX, telaInicio.spriteY, // Sprite X, Sprite Y
    telaInicio.largura, telaInicio.altura, // Tamanho do recorte da Sprite
    telaInicio.x, telaInicio.y,
    telaInicio.largura, telaInicio.altura,
);
    }
}


function criaBird(){
    const legendaryBird = {
    spriteX: 0,
    spriteY: 9,
    largura: 95,
    altura: 35,
    x: -50,
    y: 50,
    pulo: 5.0,
    pula(){ // Função pulo do bird
        console.log("[antes]", legendaryBird.velocidade)
        legendaryBird.velocidade = - legendaryBird.pulo
        console.log("[depois]", legendaryBird.velocidade)
    },
    gravidade: 0.25,
    velocidade: 0,

    atualizar(){ 
        if(colisao(legendaryBird, chao)){
            console.log("Fez colisao");
            somHit.play();

            setTimeout(() => {
                mudaTela(Telas.INICIO);
            }, 500);
            
            return; 
        }
        
        
        legendaryBird.velocidade = legendaryBird.velocidade + legendaryBird.gravidade // Calculo para controlar a gravidade/velocidade
        legendaryBird.y = legendaryBird.y + legendaryBird.velocidade
      
    },

desenhar(){ // Função para mostrar o passarinho na tela
        contexto.drawImage(
        sprites,
        legendaryBird.spriteX, legendaryBird.spriteY, // Sprite X, Sprite Y
        legendaryBird.largura, legendaryBird.altura, // Tamanho do recorte da Sprite
        legendaryBird.x, legendaryBird.y,
        legendaryBird.largura, legendaryBird.altura,
);

    }
};
    return legendaryBird;
}

const globais = {};
let telaAtiva = {};
function mudaTela(novaTela){
    telaAtiva = novaTela;

    if(telaAtiva.inicializar){
        telaAtiva.inicializar();
    }
}
const Telas = {     
    INICIO: {
        inicializar(){
        globais.legendaryBird = criaBird();
    },
        desenhar(){
            planoFundo.desenhar();
            chao.desenhar();
            globais.legendaryBird.desenhar();
            telaInicio.desenhar(); 
        },
        click(){
            mudaTela(Telas.JOGO); // Troca para a tela de jogo
        },

        atualizar(){

        }
        
    }
};

Telas.JOGO = {
    desenhar(){
        planoFundo.desenhar();
        chao.desenhar();
        globais.legendaryBird.desenhar();
},
    click(){
        globais.legendaryBird.pula();
    },
    atualizar(){
        globais.legendaryBird.atualizar();
    }     
};

function loop(){ // Importante ressaltar que essa parte funciona como camadas // Loop de atualizações que carregam as imagens do jogo
        telaAtiva.desenhar();
        telaAtiva.atualizar(); 
        requestAnimationFrame(loop); // Carregar as imagens
    }

window.addEventListener('click', function(){ // Verifica se houve click dentro do navegador
    if(telaAtiva.click){
        telaAtiva.click();
    }
})

mudaTela(Telas.INICIO); // Começa com a tela de inicio 
loop();
