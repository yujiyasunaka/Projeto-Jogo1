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
