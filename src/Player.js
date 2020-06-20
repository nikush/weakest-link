class Player {
    constructor(name) {
        this.name = name;
        this.correct = 0;
        this.incorrect = 0;
        this.banked = 0;
        this.contribution = 0;
        this.active = false;
        this.eliminated = false;
    }

    get total() {
        return this.correct + this.incorrect;
    }

    resetScoring() {
        this.correct = 0;
        this.incorrect = 0;
        this.banked = 0;
        this.contribution = 0;
    }

    sort(player) {
        if (this.correct != player.correct) {
            // this player got more correct so rank higher
            if (this.correct > player.correct) {
                return -1;
            } else {
                return 1;
            }
        }

        if (this.incorrect != player.incorrect) {
            // this player got fewer incorrect so rank higher
            if (this.incorrect < player.incorrect) {
                return -1;
            } else {
                return 1;
            }
        }

        if (this.banked != player.banked) {
            // this player banked more so rank higher
            if (this.banked > player.banked) {
                return -1;
            } else {
                return 1;
            }
        }

        if (this.contribution != player.contribution) {
            // this player contributed more with their questions so rank higher
            if (this.contribution > player.contribution) {
                return -1;
            } else {
                return 1;
            }
        }

        return 0;
    }

    clone() {
        return Object.assign(new Player, this);
    }
}

export default Player;
