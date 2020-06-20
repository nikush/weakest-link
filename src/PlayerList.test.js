import PlayerList from './PlayerList.js';
import Player from './Player.js';

describe('creational', () => {

    test('can create a new list and add players', () => {
        const list = new PlayerList();
        expect(list.length).toBe(0);

        list.add(new Player('Alex'));
        list.add(new Player('Bruce'));

        expect(list.length).toBe(2);
    });

    test('fetching all players returns a copy of the source list', () => {
        const original = new PlayerList();
        original.add(new Player('Alex'));
        original.add(new Player('Bruce'));

        // equal but not the same reference
        expect(original.all()).toEqual(original.all());
        expect(original.all()).not.toBe(original.all());

        // manipulating the copy list doesn't affect the original
        const copy = original.all();
        expect(copy.length).toBe(2);
        copy.pop();
        expect(copy.length).toBe(1);
        expect(original.length).toBe(2);

        // manipulating one of the items doesn't affect the original
        copy[0].name = 'changed';
        expect(original.list[0].name).toBe('Alex');
    });

    test('throws an error if anything but a Player object is added', () => {
        const list = new PlayerList();

        expect(() => {list.add('foo')}).toThrow(new Error('Item is not an instance of Player'));
    });

    test('creates a list from a string of names', () => {
        const list = PlayerList.fromNames(['Alex','Bruce']);

        expect(list).toBeInstanceOf(PlayerList);
        expect(list.length).toBe(2);
        expect(list.list[0]).toBeInstanceOf(Player);
        expect(list.list[0].name).toBe('Alex');
    });

});

describe('highlighting', () => {

    test('the players whos name comes first alphabetically', () => {
        const list = PlayerList.fromNames(['Chris','Alex','Bruce']);
        expect(list.all()[0].active).toBe(false);
        expect(list.all()[1].active).toBe(false);
        expect(list.all()[2].active).toBe(false);
        expect(list.activeIndex).toBe(null);

        list.highlightFirstPlayerAlphabetically();

        expect(list.all()[0].active).toBe(false);
        expect(list.all()[1].active).toBe(true);
        expect(list.all()[2].active).toBe(false);
        expect(list.activeIndex).toBe(1);
    });

    test('active players', () => {
        const list = PlayerList.fromNames(['Chris','Alex','Bruce']);

        list.highlightFirstPlayerAlphabetically();
        expect(list.all()[1].active).toBe(true);
        expect(list.activeIndex).toBe(1);

        list.highlightNextPlayer();
        expect(list.all()[0].active).toBe(false);
        expect(list.all()[1].active).toBe(false);
        expect(list.all()[2].active).toBe(true);
        expect(list.activeIndex).toBe(2);

        list.highlightNextPlayer();
        expect(list.all()[0].active).toBe(true);
        expect(list.all()[1].active).toBe(false);
        expect(list.all()[2].active).toBe(false);
        expect(list.activeIndex).toBe(0);
    });

    test('skips past eliminated players when highlighting', () => {
        const list = PlayerList.fromNames(['Chris','Alex','Bruce']);
        list.list[1].eliminated = true;
        list.list[0].active = true;
        list.activeIndex = 0;

        list.highlightNextPlayer();
        expect(list.all()[0].active).toBe(false);
        expect(list.all()[1].active).toBe(false);
        expect(list.all()[2].active).toBe(true);
        expect(list.activeIndex).toBe(1);

        list.highlightNextPlayer();
        expect(list.all()[0].active).toBe(true);
        expect(list.all()[1].active).toBe(false);
        expect(list.all()[2].active).toBe(false);
        expect(list.activeIndex).toBe(0);
    });

});

describe('scoring', () => {

    test('player answers correctly', () => {
        const list = PlayerList.fromNames(['Chris','Alex','Bruce']);
        list.highlightFirstPlayerAlphabetically();

        list.playerAnsweredCorrectly(5);

        expect(list.list[1].correct).toBe(1);
        expect(list.list[1].incorrect).toBe(0);
        expect(list.list[1].contribution).toBe(5);

        // test the index remains unchanged
        // because I think I might change this behaviour later
        expect(list.activeIndex).toBe(1);
    });

    test('player answers incorrectly', () => {
        const list = PlayerList.fromNames(['Chris','Alex','Bruce']);
        list.highlightFirstPlayerAlphabetically();

        list.playerAnsweredIncorrectly(5);

        expect(list.list[1].correct).toBe(0);
        expect(list.list[1].incorrect).toBe(1);
        expect(list.list[1].contribution).toBe(-5);

        expect(list.activeIndex).toBe(1);
    });

    test('player banked', () => {
        const list = PlayerList.fromNames(['Chris','Alex','Bruce']);
        list.highlightFirstPlayerAlphabetically();

        list.playerBanked(5);

        expect(list.list[1].correct).toBe(0);
        expect(list.list[1].incorrect).toBe(0);
        expect(list.list[1].contribution).toBe(0);
        expect(list.list[1].banked).toBe(5);

        expect(list.activeIndex).toBe(1);
    });

    test('sorted by score', () => {
        const alex = new Player('Alex');
        alex.correct = 1;
        alex.incorrect = 2;
        const bruce = new Player('Bruce');
        bruce.eliminated = true;
        const chris = new Player('Chris');
        chris.correct = 1;
        chris.incorrect = 1;

        const list = new PlayerList();
        list.add(alex);
        list.add(bruce);
        list.add(chris);

        const ranked = list.getRemainingPlayersRanked();

        expect(ranked.length).toBe(2);
        expect(ranked[0].name).toBe('Chris');
        expect(ranked[1].name).toBe('Alex');
    });

});

test('eliminate a player by name', () => {
    const list = PlayerList.fromNames(['Alex','Bruce','Chrise']);
    expect(list.list[1].eliminated).toBe(false);

    list.eliminatePlayerByName('Bruce');

    expect(list.list[1].eliminated).toBe(true);
});
