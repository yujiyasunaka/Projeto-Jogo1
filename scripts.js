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