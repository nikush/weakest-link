import RoundLogic from './RoundLogic.js';

test('creates a new instance', () => {
    const roundLogic = new RoundLogic();

    expect(roundLogic.linkValues.length).toBe(9);
    expect(roundLogic.answerStreak).toBeNull();
    expect(roundLogic.round).toBe(0);
    expect(roundLogic.bank).toBe(0);
    expect(roundLogic.kitty).toBe(0);
});

test('can manipulate the answer streak', () => {
    const roundLogic = new RoundLogic();
    expect(roundLogic.answerStreak).toBeNull();

    roundLogic.incrementAnswerStreak();
    roundLogic.incrementAnswerStreak();
    expect(roundLogic.answerStreak).toBe(2);

    roundLogic.decrementAnswerStreak();
    expect(roundLogic.answerStreak).toBe(1);

    roundLogic.resetAnswerStreak();
    expect(roundLogic.answerStreak).toBe(0);

    roundLogic.clearAnswerStreak();
    expect(roundLogic.answerStreak).toBeNull();
});

test('gets the current link index', () => {
    const roundLogic = new RoundLogic();

    roundLogic.resetAnswerStreak();
    expect(roundLogic.getCurrentLinkIndex()).toBe(0);

    roundLogic.incrementAnswerStreak();
    expect(roundLogic.getCurrentLinkIndex()).toBe(1);

    // capped at the maximum number of links
    roundLogic.answerStreak = 100;
    expect(roundLogic.getCurrentLinkIndex()).toBe(8);
});

test('gets the acquired value in the chain', () => {
    const roundLogic = new RoundLogic();

    roundLogic.resetAnswerStreak();
    expect(roundLogic.answerStreak).toBe(0);
    expect(roundLogic.getAcquiredValueInChain()).toBe(0);

    roundLogic.incrementAnswerStreak();
    expect(roundLogic.answerStreak).toBe(1);
    expect(roundLogic.getAcquiredValueInChain()).toBe(0.2);

    roundLogic.incrementAnswerStreak();
    expect(roundLogic.answerStreak).toBe(2);
    expect(roundLogic.getAcquiredValueInChain()).toBe(0.5);

    // skip ahead a bit
    roundLogic.answerStreak = 8
    expect(roundLogic.getAcquiredValueInChain()).toBe(8);

    roundLogic.incrementAnswerStreak();
    expect(roundLogic.answerStreak).toBe(9);
    expect(roundLogic.getAcquiredValueInChain()).toBe(10);

    // answer streak can continue growing but the acquired value is capped
    roundLogic.incrementAnswerStreak();
    expect(roundLogic.answerStreak).toBe(10);
    expect(roundLogic.getAcquiredValueInChain()).toBe(10);
});

test('can bank progress', () => {
    const roundLogic = new RoundLogic();

    roundLogic.resetAnswerStreak();
    expect(roundLogic.bank).toBe(0);

    roundLogic.incrementAnswerStreak();
    roundLogic.bankProgress();
    expect(roundLogic.bank).toBe(0.2);
    expect(roundLogic.answerStreak).toBe(0);

    roundLogic.incrementAnswerStreak();
    roundLogic.incrementAnswerStreak();
    roundLogic.incrementAnswerStreak();
    roundLogic.bankProgress();
    expect(roundLogic.bank).toBe(1.2);
    expect(roundLogic.answerStreak).toBe(0);
});

test('the bank is capped at the maximum value in the chain', () => {
    const roundLogic = new RoundLogic();

    roundLogic.resetAnswerStreak();
    roundLogic.bank = 9;
    roundLogic.answerStreak = 5;

    roundLogic.bankProgress();
    expect(roundLogic.bank).toBe(10);
});

test('can tell when the maximum value has been banked', () => {
    const roundLogic = new RoundLogic();
    expect(roundLogic.hasBankedMaximumValue()).toBe(false);

    roundLogic.bank = 5;
    expect(roundLogic.hasBankedMaximumValue()).toBe(false);

    roundLogic.bank = 5;
    expect(roundLogic.hasBankedMaximumValue()).toBe(false);

    roundLogic.bank = 10;
    expect(roundLogic.hasBankedMaximumValue()).toBe(true);
});

test('can set the round for the correct number of players', () => {
    const roundLogic = new RoundLogic();
    expect(roundLogic.round).toBe(0);

    roundLogic.setRoundForNumberOfPlayers(9);
    expect(roundLogic.round).toBe(1);

    roundLogic.setRoundForNumberOfPlayers(8);
    expect(roundLogic.round).toBe(2);

    roundLogic.setRoundForNumberOfPlayers(7);
    expect(roundLogic.round).toBe(3);

    // skip ahead a bit
    roundLogic.setRoundForNumberOfPlayers(3);
    expect(roundLogic.round).toBe(7);

    roundLogic.setRoundForNumberOfPlayers(2);
    expect(roundLogic.round).toBe(8);
});

test('can end the round', () => {
    const roundLogic = new RoundLogic();

    roundLogic.round = 1;
    roundLogic.answerStreak = 5;
    roundLogic.bank = 5;
    roundLogic.kitty = 10;

    const summary = roundLogic.endRound();

    expect(roundLogic.round).toBe(2);
    expect(roundLogic.answerStreak).toBeNull();
    expect(roundLogic.bank).toBe(0);
    expect(roundLogic.kitty).toBe(15);

    expect(summary.round).toBe(1);
    expect(summary.bank).toBe(5);
    expect(summary.kitty).toBe(10);
});

test('ending the final round multiplies the bank by 3', () => {
    const roundLogic = new RoundLogic();

    roundLogic.round = 8;
    roundLogic.answerStreak = 5;
    roundLogic.bank = 5;
    roundLogic.kitty = 10;

    const summary = roundLogic.endRound();

    expect(roundLogic.round).toBe(9);
    expect(roundLogic.answerStreak).toBeNull();
    expect(roundLogic.bank).toBe(0);
    expect(roundLogic.kitty).toBe(25);

    expect(summary.round).toBe(8);
    expect(summary.bank).toBe(15);
    expect(summary.kitty).toBe(10);
});
