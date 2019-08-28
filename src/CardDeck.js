import React, { Component } from 'react';
import Card from './Card';
import axios from 'axios';
import './CardDeck.css'

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";


class CardDeck extends Component {
    constructor(props) {
        super(props);
        this.state = {
          deck: null,
          drawnCards: [],
        };
        this.getCard = this.getCard.bind(this);
    }

    async componentDidMount() {
        //load data
       let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
       this.setState({deck: deck.data});
    }

    async getCard() {
        //make request using deck id
        let deckId = this.state.deck.deck_id;
        try {
            let cardUrl = `${API_BASE_URL}/${deckId}/draw/`;
            let cardResponse = await axios.get(cardUrl);
            if(!cardResponse.data.success && cardResponse.data.remaining === 0 ){
                throw new Error("No cards remaining!")
            }
            let card = cardResponse.data.cards[0];
            this.setState(state => ({
                drawnCards: [
                    ...state.drawnCards,
                    {
                        id: card.code,
                        image: card.image,
                        name: `${card.value} ${card.suit}`
                    }
                ]
            }));
            
        }
        catch(err){
            alert(err);
        }
    }

    render() {
        const cards = this.state.drawnCards.map(c => (
            <Card name={c.name} image={c.image} key={c.id} />
        ));

        return (
            <div>
                <h1>Deckard</h1>
                <button onClick={this.getCard}>Deal card</button>
                <div className="deck" >
                {cards}
                
                </div>
            </div>
        )
    }
}

export default CardDeck;
