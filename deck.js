
function Card(number){

    var self = {};

    var penalty = 1;
    if (number == 55){
        penalty = 7;
    } else if (number % 11 == 0){
        penalty = 5;
    } else if (number % 10 == 0){
        penalty = 3;
    } else if (number % 5 == 0){
        penalty = 2;
    }
    self.number = number;
    self.penalty = penalty;
    self.owner = null;

    self.render = function(is_pickup){
        var id = "card-" + self.number;
        var classes = "card penalty-" + self.penalty;
        if (self.owner && !is_pickup){
            classes += " clickable-card";
        }
        return '<div id="' + id + '" class="' + classes + '">' + self.number + '</div>';
    }

    return self;
}

function Deck(){

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }

    function make_deck(){
        var deck = [];
        for (var i = 1; i <= 104; i++){
            deck.push(Card(i));
        }
        shuffle(deck);
        return deck;
    }

    var self = {};
    self._deck = make_deck();
    self.draw = function(number_cards){
        number_cards = number_cards || 1;
        var out = [];
        for (var i = 0; i < number_cards; i++){
            out.push(self._deck.pop());
        }
        if (number_cards == 1){
            return out[0];
        }
        return out;
    };
    return self;
}
