
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
    };
    api.penalty = function(){
        var penalty = 0;
        self.cards.forEach(function (card){
            penalty += card.penalty;
        });
        return penalty;
    };
    api.difference = function(card){
        var tail = api.peek();
        if (tail < card.number){
            return card.number - tail;
        }
        return null;
    };
    api.empty = function(card){
        card.owner.penalize(api.penalty());
        self.cards = [];
        api.push(card);
    };
    api.render = function(){
        var html = "";
        self.cards.forEach(function (card){
            html += card.render();
        });
        html += '<div class="float-clear"></div>';
        return html;
    };

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
    };
    api.render = function(){
        var html = "";
        self.hand.forEach(function (card){
            html += card.render();
        })
        return html;
    };
    api.play_card = function(number){
        var index = null;
        for (var i = 0; i < self.hand.length; i++){
            if (self.hand[i].number == number){
                index = i;
            }
        }
        if (index == null){
            throw "failed to play card";
        }
        return self.hand.splice(index, 1)[0];
    }

    return api;
}

function Board(){

    var self = {};
    var api = {};
    
    self.deck = null;
    self.rows = null;
    self.players = null;
    self.player = null;

    api.setup = function(){
        self.deck = Deck();
        self.rows = [];
        for (var i = 0; i < NUM_ROWS; i++){
            var new_row = Row();
            new_row.push(self.deck.draw());
            self.rows.push(new_row);
            $('#board').append(
                '<div id="row-' + i + '" class="row"></div>'
            );
        }
        self.players = [];
        for (var i = 0; i < 1; i++){
            var new_player = Player();
            new_player.deal(self.deck.draw(10));
            self.players.push(new_player);
        }
        self.player = self.players[0];
        api.render();
    };

    api.play = function(card){
        var best_row = null;
        var best_row_difference = 104;
        for (var i = 0; i < NUM_ROWS; i++){
            var current_row = self.rows[i];
            var difference = current_row.difference(card);
            if (difference && difference < best_row_difference){
                best_row = current_row;
                best_row_difference = difference;
            }
        }
        if (best_row){
            best_row.push(card);
        } else {
            // todo logic for choosing row
            self.rows[0].empty(card);
        }
        api.render();
    };

    api.render = function(){
        for (var i = 0; i < NUM_ROWS; i++){
            var row = self.rows[i];
            $('#row-' + i).html(row.render());
        }
        $('#hand').html(self.player.render());
        $('#hand').append('<div class="float-clear"></div>');
        $('.clickable').on('click', function(){
            var number = $(this).attr('id').split('card-')[1];
            var card = self.player.play_card(number);
            api.play(card);
        });
    }

    return api;
}