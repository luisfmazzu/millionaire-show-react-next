import React, { useState, useEffect } from 'react';
import './CardModal.css';

// Card images (you would need to add these to your project)
import aceImage from './ace.png';
import twoImage from './two.png';
import threeImage from './three.png';

const cardImages = {
  ace: aceImage,
  two: twoImage,
  three: threeImage
};

const CardModal = ({ isOpen, onClose, onCardSelected }) => {
  const cardValues = ['ace', 'two', 'three'];
  const [flippedCard, setFlippedCard] = useState(null);
  const [cardOrder, setCardOrder] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const shuffled = [...cardValues].sort(() => Math.random() - 0.5);
      setCardOrder(shuffled);
      setFlippedCard(null);
    }
  }, [isOpen]);

  const handleCardClick = (card) => {
    if (!flippedCard) {
      setFlippedCard(card);
      if (onCardSelected) {
        onCardSelected(cardValues.indexOf(card));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="cards-container">
          {cardOrder.map((card) => (
            <div
              key={card}
              className={`card ${flippedCard === card ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-back">?</div>
                <div className="card-front">
                  <img src={cardImages[card]} alt={card} className="card-image" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardModal;