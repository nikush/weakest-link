import Player from './Player.js';

class PlayerList {
    constructor() {
        this.list = [];
        this.activeIndex = null;
    }

    static fromNames(names) {
        const list = new PlayerList();
        for (let name of names) {
            list.add(new Player(name));
        }
        return list;
    }

    add(player) {
        if (!(player instanceof Player)) {
            throw new Error('Item is not an instance of Player');
        }

        this.list.push(player);
    }

    all() {
        return this.list.map(player => player.clone());
    }

    get length() {
        return this.list.length;
    }

    highlightFirstPlayerAlphabetically() {
        const firstName = this.list.map(player => player.name).sort()[0];
        for (let player of this.list) {
            if (player.name == firstName) {
                player.active = true;
                this.activeIndex = this.list.indexOf(player);
                break;
            }
        }
    }

    highlightNextPlayer() {
        const remainingPlayers = this.remainingPlayers();
        remainingPlayers[this.activeIndex].active = false; // remove highlight from current player

        this.activeIndex++;
        if (this.activeIndex == remainingPlayers.length) {
            this.activeIndex = 0;
        }
        remainingPlayers[this.activeIndex].active = true;
    }

    highlightStrongestPlayer() {
        const strongestPlayer = this.getRemainingPlayersRanked()[0];
        strongestPlayer.active = true;
        this.activeIndex = this.remainingPlayers().indexOf(strongestPlayer);
    }

    remainingPlayers() {
        return this.list.filter(player => !player.eliminated);
    }

    activePlayer() {
        return this.remainingPlayers()[this.activeIndex];
    }

    playerAnsweredCorrectly(value) {
        const player = this.activePlayer();
        const originalContribution = player.contribution;
        player.correct++;
        player.contribution += value;

        if (isNaN(player.contribution)) {
            console.warn('player contribution isNaN after:', originalContribution, value);
        }
    }

    playerAnsweredIncorrectly(value) {
        const player = this.activePlayer();
        const originalContribution = player.contribution;
        player.incorrect++;
        player.contribution -= value;

        if (isNaN(player.contribution)) {
            console.warn('player contribution isNaN after:', originalContribution, value);
        }
    }

    playerBanked(value) {
        const player = this.activePlayer();
        player.banked += value;
    }

    getRemainingPlayersRanked() {
        const remainingPlayers = this.remainingPlayers();
        return remainingPlayers.sort((a,b) => a.sort(b));
    }

    eliminatePlayerByName(name) {
        // remove highlight from current player
        const remainingPlayers = this.remainingPlayers();
        remainingPlayers[this.activeIndex].active = false;

        for (const player of this.remainingPlayers()) {
            if (player.name == name) {
                player.eliminated = true;
                break;
            }
        }

        this.highlightStrongestPlayer();
        this.resetScores();
    }

    resetScores() {
        for (let player of this.list) {
            player.resetScoring();
        }
    }
}

export default PlayerList;
