// === Configuração inicial do canvas e contexto de desenho ===
const canvas = document.getElementById("gameCanvas");
const contexto = canvas.getContext("2d");

// === Variáveis de controle de jogo ===
let quadros = 0;
let tubosPassados = 0;
let pontuacaoTubos = 0;
const TUBOS_ATE_CHEFAO = 15;
let cutsceneImagemCarregada = false;
let mortePorChefao = false;
let vidaJamal = 12;
let vidaChefao = 30;
let chefaoEscudo = false;
let escudoAtivo = false;
let faseBoss = 1;
let chefaoIntervaloDisparo = 20;
let chefaoDisparoTriplo = false;
let pocoes = [];
let tempoUltimaPocao = 0;
let intervaloPocao = 3000;
let tempoEscudoAtivo = 0;
let escudoDuracao = 3000;
let jogoRodando = false;
let cutscenePodeAvancar = false;
let gravidadeSuspensa = false;
let energiaJamal = 0;
let especialDisponivel = false;
let explosaoAtiva = false;
let tempoExplosao = 0;
let tremorTela = false;
let intensidadeTremor = 5;
let tempoTremor = 0;
let tempoPortal = 0;

// === Definição dos estados possíveis do jogo ===
const estados = {
  PRONTO: 0,
  TUBOS: 1,
  CHEFAO: 2,
  DERROTA: 3,
  VITORIA: 4,
  CUTSCENE_INICIO: 5,
  CUTSCENE_BOSS: 6,
  CUTSCENE_VITORIA: 7,
  TRANSICAO_PORTAL: 8
};

let estadoAtual = estados.PRONTO;

// === Cutscenes (sequências de imagens entre fases) ===
let cutsceneIndex = 0;
const imagensCutsceneInicio = ["img/cutscene1.png", "img/cutscene2.png", "img/cutscene3.png"];
const imagensCutsceneBoss = ["img/cutscene4.png"];
const imagensCutsceneVictoria = ["img/cutscene5.png"];

// === Recursos de áudio e imagem ===
const musicaFundo = new Audio("music/musicajogo.mp3");
musicaFundo.loop = true;
musicaFundo.volume = 0.5;

const suspenseFundo = new Audio('./music/suspensefundo.mp3');
suspenseFundo.loop = true;
suspenseFundo.volume = 0.8;


const imagemCutscene = new Image();
const imagemFundo = new Image();
imagemFundo.src = "img/bg-battle.png";
const imagemChefao = new Image();
imagemChefao.src = "img/boss-open.png";
const imagemTubo = new Image();
imagemTubo.src = "img/tubo-cigarro.png";
const imagemJamal = new Image();
imagemJamal.src = "img/jamal.png";
const imagemTelaMorteBoss = new Image();
imagemTelaMorteBoss.src = "img/telamorteboss.png";
const imagemMenu = new Image();
imagemMenu.src = "img/menu.png";
const ataqueBoss = new Image();
ataqueBoss.src = "img/bandeira.png"
const ataqueJamal = new Image();
ataqueJamal.src = "img/cigarro2.png"
const imagemPocao = new Image();
imagemPocao.src = "img/pocao.png";
const imagemExplosao = new Image();
imagemExplosao.src = "img/explosao.png";
let imagemPortal = new Image();
imagemPortal.src = "img/portal.png";
const imagemVida = new Image();
imagemVida.src = "img/vida.png";


const somCaiu = new Audio("sounds/efeitos_caiu.wav");
const somHit = new Audio("sounds/efeitos_hit.wav");
const somPonto = new Audio("sounds/efeitos_ponto.wav");
const somPulo = new Audio("sounds/efeitos_pulo.wav");

// === Objeto que representa o jogador (Jamal) ===
const jamal = {
  x: 80,
  y: 200,
  largura: 32,
  altura: 32,
  gravidade: 0.35,
  velocidade: 30,
  pulo: -6.2,

  pular() {
    this.velocidade = this.pulo;
  },

  atualizar() {
    if (gravidadeSuspensa) return;
    this.velocidade += this.gravidade;
    this.y += this.velocidade;
    // Verifica se caiu no chão (perdeu)
    if ((estadoAtual === estados.TUBOS || estadoAtual === estados.CHEFAO) && this.y + this.altura >= canvas.height) {
      if (estadoAtual === estados.CHEFAO) mortePorChefao = true;
      estadoAtual = estados.DERROTA;
      pararMusicaFundo();
    }
    // Limita Jamal para não ultrapassar o topo da tela
    if (this.y <= 0) {
      this.y = 0;
      this.velocidade = 0;
    }
  },

  desenhar() {
    contexto.drawImage(imagemJamal, this.x, this.y, this.largura, this.altura);
  },

  reiniciar() {
    this.y = 200;
    this.velocidade = 0;
    pontuacaoTubos = 0;
    vidaJamal = 4;
    vidaChefao = 15;
    this.x = 30;
  }
};

// === Controle de música de fundo ===
function pararMusicaFundo() {
  musicaFundo.pause();
  musicaFundo.currentTime = 0;
}

function gerenciarMusica() {
  if (
    estadoAtual === estados.CUTSCENE_INICIO ||
    estadoAtual === estados.CUTSCENE_BOSS ||
    estadoAtual === estados.CUTSCENE_VITORIA ||
    estadoAtual === estados.CHEFAO ||
    estadoAtual === estados.DERROTA
  ) {
    if (!musicaFundo.paused) musicaFundo.pause();
  } else if (musicaFundo.paused && estadoAtual === estados.TUBOS) {
    musicaFundo.play();
  }
}

// === Controle de imagens de cutscene ===
function carregarImagemCutscene(src) {
  cutsceneImagemCarregada = false;
  imagemCutscene.onload = () => {
    cutsceneImagemCarregada = true;
  };
  imagemCutscene.src = src;
}

// === Lógica ao clicar ou apertar espaço ===
function lidarComPulo() {
  if (estadoAtual === estados.CUTSCENE_INICIO) {
    if (!cutscenePodeAvancar) return;

    if (cutsceneIndex === 0) {
      suspenseFundo.play();
    }

    cutsceneIndex++;
    if (cutsceneIndex >= imagensCutsceneInicio.length) {
      suspenseFundo.pause();
      suspenseFundo.currentTime = 0;

      estadoAtual = estados.TUBOS;
      iniciarJogo();
      musicaFundo.play();
    }
    else {
      carregarImagemCutscene(imagensCutsceneInicio[cutsceneIndex]);
      cutscenePodeAvancar = false;
      setTimeout(() => {
        cutscenePodeAvancar = true;
      }, 3000);
    }
  } else if (estadoAtual === estados.CUTSCENE_BOSS) {
    if (!cutscenePodeAvancar) return;

    cutsceneIndex++;
    if (cutsceneIndex >= imagensCutsceneBoss.length) {
      estadoAtual = estados.CHEFAO;
      suspenseFundo.pause();
      suspenseFundo.currentTime = 0;
      gravidadeSuspensa = true;
      setTimeout(() => {
        gravidadeSuspensa = false;
      }, 500);
    } else {
      carregarImagemCutscene(imagensCutsceneBoss[cutsceneIndex]);
    }
  } else if (estadoAtual === estados.TUBOS || estadoAtual === estados.CHEFAO) {
    somPulo.play();
    jamal.pular();
  } else if (estadoAtual === estados.PRONTO) {
    estadoAtual = estados.CUTSCENE_INICIO;
    cutsceneIndex = 0;
    carregarImagemCutscene(imagensCutsceneInicio[cutsceneIndex]);
    musicaFundo.pause();
    musicaFundo.currentTime = 0;
    suspenseFundo.currentTime = 0;
    suspenseFundo.play();
    cutscenePodeAvancar = false;
    setTimeout(() => {
      cutscenePodeAvancar = true;
    }, 3000);
  }
}

const botaoStart = {
  x: canvas.width / 2 - 85, // centralizado
  y: canvas.height - 100,   // perto da parte inferior
  largura: 170,
  altura: 50
};

// === Eventos de clique e teclado ===
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  if (estadoAtual === estados.PRONTO) {
    if (
      clickX >= botaoStart.x &&
      clickX <= botaoStart.x + botaoStart.largura &&
      clickY >= botaoStart.y &&
      clickY <= botaoStart.y + botaoStart.altura
    ) {
      estadoAtual = estados.CUTSCENE_INICIO;
      cutsceneIndex = 0;
      carregarImagemCutscene(imagensCutsceneInicio[cutsceneIndex]);
      musicaFundo.pause();
      musicaFundo.currentTime = 0;
      return;
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "F9") { // Verifica se a tecla pressionada é F9
      // Força o jogo a ir direto para a cutscene da boss fight
      estadoAtual = estados.CUTSCENE_BOSS;
      cutsceneIndex = 0; // Reinicia o índice da cutscene para a do boss
      cutscenePodeAvancar = false; // Garante que não avança imediatamente se a cutscene do boss tiver um delay

      // Carrega a primeira imagem da cutscene do boss
      // Assumindo que imagensCutsceneBoss tem pelo menos uma imagem
      carregarImagemCutscene(imagensCutsceneBoss[cutsceneIndex]);

      // Suspende temporariamente a gravidade como na transição normal
      // Isso é importante para Jamal não cair durante a transição
      gravidadeSuspensa = true;
      setTimeout(() => {
        gravidadeSuspensa = false;
        cutscenePodeAvancar = true; // Permite avançar a cutscene após o delay
      }, 500); // Meio segundo de gravidade suspensa, ajuste se necessário

      // Reinicia elementos do jogo para evitar bugs na transição
      jamal.reiniciar();
      tubos.reiniciar(); // Limpa os tubos existentes
      chefao.reiniciar(); // Garante que o chefe comece do zero
      pararMusicaFundo(); // Para a música dos tubos se estiver tocando
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "e" || e.key === "E") {
      if (especialDisponivel && estadoAtual === estados.CHEFAO) {
        ativarAtaqueEspecial();
      }
    }
  });

  lidarComPulo();
});

// === Tubos (obstáculos do jogo) ===
const tubos = {
  posicoes: [],
  largura: 124,
  altura: 400,
  espaco: 100,

  desenhar() {
    this.posicoes.forEach(tubo => {
      // Tubo superior (invertido)
      contexto.save();
      contexto.translate(tubo.x + this.largura / 2, tubo.y + this.altura / 2);
      contexto.rotate(Math.PI);
      contexto.drawImage(imagemTubo, -this.largura / 2, -this.altura / 2, this.largura, this.altura);
      contexto.restore();

      // Tubo inferior
      const yInferior = tubo.y + this.altura + this.espaco;
      contexto.drawImage(imagemTubo, tubo.x, yInferior, this.largura, this.altura);
    });
  },

  atualizar() {
    if (tubosPassados < TUBOS_ATE_CHEFAO && quadros % 150 === 0) {
      let y = -Math.floor(Math.random() * 150);
      this.posicoes.push({ x: canvas.width, y, jaPontuado: false });
    }

    this.posicoes.forEach((tubo, i) => {
      tubo.x -= 3;

      // Detecção de colisão com Jamal
      const margemXJamal = 6;
      const margemYJamal = 6;
      const px = jamal.x + margemXJamal;
      const py = jamal.y + margemYJamal;
      const pw = jamal.largura - 2 * margemXJamal;
      const ph = jamal.altura - 2 * margemYJamal;

      const tuboEsquerda = tubo.x + 30;
      const tuboDireita = tubo.x + this.largura - 30;
      const tuboTopo = tubo.y + 36;
      const tuboBase = tubo.y + this.altura + this.espaco + 36;

      const colisaoTopo = px + pw > tuboEsquerda && px < tuboDireita && py < tuboTopo + this.altura - 72;
      const colisaoBase = px + pw > tuboEsquerda && px < tuboDireita && py + ph > tuboBase;

      if (colisaoTopo || colisaoBase) {
        somCaiu.currentTime = 0;
        somCaiu.play();
        this.reiniciar();
        jamal.reiniciar();
        chefao.reiniciar();
        estadoAtual = estados.PRONTO;
        pararMusicaFundo();
      }

      // Contagem de pontos
      if (!tubo.jaPontuado && tubo.x + this.largura < jamal.x) {
        tubo.jaPontuado = true;
        pontuacaoTubos++;
        tubosPassados++;
        somPonto.currentTime = 0;
        somPonto.play();

        // Início da cutscene do chefe
        if (tubosPassados >= TUBOS_ATE_CHEFAO) {
          estadoAtual = estados.TRANSICAO_PORTAL;
          tempoPortal = Date.now();
        }
      }

      // Remove tubos fora da tela
      if (tubo.x + this.largura < 0) {
        this.posicoes.shift();
      }
    });
  },

  reiniciar() {
    this.posicoes = [];
    tubosPassados = 0;
    pontuacaoTubos = 0;
  }
};