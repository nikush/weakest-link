import GameEnumeration from './GameEnumeration.js';

export default class {
    constructor() {
        this.linkValues = [0.2, 0.5, 1, 2, 3, 4.5, 6, 8, 10];
        this.answerStreak = null;
        this.round = 0;
        this.bank = 0;
        this.kitty = 0;
    }

    incrementAnswerStreak() {
        this.answerStreak++;
    }
    decrementAnswerStreak() {
        if (this.answerStreak > 0) {
            this.answerStreak--;
        }
    }
    resetAnswerStreak() {
        this.answerStreak = 0;
    }
    clearAnswerStreak() {
        this.answerStreak = null;
    }

    getCurrentLinkIndex() {
        return Math.min(this.answerStreak, this.linkValues.length-1);
    }

    getAcquiredValueInChain() {
        const maxValue = Math.min(this.answerStreak, this.linkValues.length);
        return this.linkValues[maxValue-1] || 0;
    }

    bankProgress() {
        this.bank += this.getAcquiredValueInChain();

        const maxLinkValue = this.linkValues[this.linkValues.length-1];
        if (this.bank > maxLinkValue) {
            this.bank = maxLinkValue;
        }

        this.resetAnswerStreak();
    }

    hasBankedMaximumValue() {
        return this.bank == this.linkValues[this.linkValues.length-1];
    }

    endRound() {
        this.clearAnswerStreak();

        // final round logic
        if (this.round == GameEnumeration.rounds.length) {
            this.bank *= 3;
        }

        const summary = {round: this.round, bank: this.bank, kitty: this.kitty}

        this.kitty += this.bank;
        this.bank = 0;
        this.round++;

        return summary;
    }

    setRoundForNumberOfPlayers(numPlayers) {
        this.round = (GameEnumeration.maxPlayers - numPlayers) + 1;
    }
}
