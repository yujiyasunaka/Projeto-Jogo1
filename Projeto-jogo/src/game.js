import Evets from 'events';
import Config from './config.js';

let game = {
    score: {
        score: 0,
        record: 0,
        addScore: function(){
            this.score++;
            if (this.score > this.record) {

            }
            game.events.emit('scoreUpdate');
        },
        clearScore: function() {
            this.score = 0;
            game.events.emit('scoreUpdate');
        }
    },
    events: new Events.EventEmitter(),
    limits: {
        maxHeight: Config.app.height,
        minHeight: Config.bird.height
    },

    stateNow: null,
    stateList: {
        reset: 'reset',
        ready: 'ready',
        running: 'running',
        pause: 'pause',
        over: 'over',
        stop: 'stop',
    },
    timer: {
        isRunning: false,
        timerId: 0,
        start (){
            console.log('game.js:timer start');
            this.timeId = setInterval(() => {
                game.events.emit('timer');
            }, Config.app.refreshInterval);
            this.isRunning = true;
        },
        stop () {
            console.log('game.js:timer stop');
            clearInterval(this.timerId);
            this.isRunning = false;
        }
    },
    spaceOrTouch() {
        switch (game.stateNow) {
            case game.stateList.ready:
                game.setState(game.stateList.running);
                break;
            case game.stateList.running:
                game.events.emit('space');
                break;
            case game.stateList.pause:
                game.stateList(game.stateList.reset);
                game.stateList(game.stateList.ready);
                break;
            default:
                break;
        }
    },
    init () {
        this.score.clearScore();
    }
}