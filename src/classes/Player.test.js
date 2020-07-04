import Player from './Player.js';

test('can instanciate a new player', () => {
    const alex = new Player('Alex');

    expect(alex.name).toBe('Alex');
    expect(alex.correct).toBe(0);
    expect(alex.incorrect).toBe(0);
    expect(alex.banked).toBe(0);
    expect(alex.contribution).toBe(0);
});

test('can reset a players scoring properties', () => {
    const alex = new Player('Alex');
    alex.correct = 1;
    alex.incorrect = 1;
    alex.banked = 1;
    alex.contribution = 1;

    alex.resetScoring();

    expect(alex.name).toBe('Alex');
    expect(alex.correct).toBe(0);
    expect(alex.incorrect).toBe(0);
    expect(alex.banked).toBe(0);
    expect(alex.contribution).toBe(0);
});

test('total getter sums both correct and incorrect answers', () => {
    const alex = new Player('Alex');
    expect(alex.total).toBe(0);

    alex.correct++;
    expect(alex.total).toBe(1);

    alex.incorrect++;
    expect(alex.total).toBe(2);
});

describe('sorts two players based on', () => {

    test('number of correct answers', () => {
        const alex = new Player('Alex');
        const bruce = new Player('Bruce');
        expect(alex.sort(bruce)).toBe(0);

        // alex got more correct so rank him higher
        alex.correct = 2;
        bruce.correct = 1;
        expect(alex.sort(bruce)).toBe(-1);

        // alex got fewer correct so rank him lower
        alex.correct = 1;
        bruce.correct = 2;
        expect(alex.sort(bruce)).toBe(1);
    });

    test('number of incorrect answers', () => {
        const alex = new Player('Alex');
        const bruce = new Player('Bruce');

        // alex got fewer incorrect so rank him higher
        alex.incorrect = 1;
        bruce.incorrect = 2;
        expect(alex.sort(bruce)).toBe(-1);

        // alex got more incorrect so rank him lower
        alex.incorrect = 2;
        bruce.incorrect = 1;
        expect(alex.sort(bruce)).toBe(1);
    });

    test('amount banked', () => {
        const alex = new Player('Alex');
        const bruce = new Player('Bruce');

        // alex banked more so rank him higher
        alex.banked = 10;
        bruce.banked = 5;
        expect(alex.sort(bruce)).toBe(-1);

        // alex banked less so rank him lower
        alex.banked = 5;
        bruce.banked = 10;
        expect(alex.sort(bruce)).toBe(1);
    });


    test('question contribution', () => {
        const alex = new Player('Alex');
        const bruce = new Player('Bruce');

        // alex contributed more so rank him higher
        alex.contribution = 10;
        bruce.contribution = 5;
        expect(alex.sort(bruce)).toBe(-1);

        // alex contributed less so rank him lower
        alex.contribution = 5;
        bruce.contribution = 10;
        expect(alex.sort(bruce)).toBe(1);
    });

});

test('can clone the player object', () => {
    const alex = new Player('Alex');
    const clone = alex.clone();
    expect(clone).toEqual(alex);
    expect(clone).not.toBe(alex);

    // changing a property on one shouldn't affect the other
    clone.name = 'Bruce';
    expect(clone.name).toBe('Bruce');
    expect(alex.name).toBe('Alex');
});

test.todo('active and eliminated flags');
