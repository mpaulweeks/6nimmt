
// requires deck.js

NUM_ROWS = 4;
ROW_MAX = 5;

function Row(){

    var api = {};
    var self = {};
    self.cards = [];

    api.push = function(card){
        if (self.cards.length == ROW_MAX){
            api.empty(card); //loops safely
        } else {
            card.owner = null;
            self.cards.push(card);
        }
    };
    api.peek = function(){
        return self.cards[self.cards.length - 1].number;
    }
    api.penalty = function(){
        var penalty = 0;
        self.cards.forEach(function (card){
            penalty += card.penalty;
        });
        return penalty;
    }
    api.difference = function(card){
        var tail = api.peek();
        if (tail < card.number){
            return card.number - tail;
        }
        return null;
    }
    api.empty = function(card){
        card.owner.penalize(api.penalty());
        self.cards = [];
        api.push(card);
    }

    return api;
}

function Player(){

    var self = {};
    var api = {};

    self.hand = [];
    self.penalty_points = 0;

    api.deal = function(cards){
        cards.forEach(function (card){
            card.owner = api;
            self.hand.push(card);
        });
    };
    api.penalize = function(penalty_points){
        self.penalty_points += penalty_points;
    }

    return api;
}

function Board(){

    var self = {};
    
    self.deck = null;
    self.rows = null;
    self.players = null;

    function setup(){
        self.deck = Deck();
        self.rows = [];
        for (var i = 0; i < NUM_ROWS; i++){
            var new_row = Row();
            new_row.push(self.deck.draw());
            self.rows.push(new_row);
        }
        self.players = [];
        for (var i = 0; i < 1; i++){
            var new_player = Player();
            new_player.deal(self.deck.draw(10));
            self.players.push(new_player);
        }
    }

    function play(card){
        var best_row = null;
        var best_row_difference = 104;
        for (var i = 0; i < NUM_ROWS; i++){
            var current_row = self.rows[i];
            var difference = current_row.difference(card);
            if (difference && difference < best_row_difference){
                best_row = row;
                best_row_difference = difference;
            }
        }
        if (best_row){
            best_row.push(card);
        } else {
            // todo logic for choosing row
            self.rows[0].empty(card);
        }
    }

}