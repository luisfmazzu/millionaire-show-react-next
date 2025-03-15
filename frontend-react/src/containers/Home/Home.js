import React from 'react';
import { useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useQuestionSetContext } from '../../context/QuestionSetProvider';

import './Home.css';

const Home = (props) => {
  // Destructuring
  const { setGameStarted } = props;
  
  const [inputNumber, setInputNumber] = useState(1);
  const { setQuestionSet } = useQuestionSetContext();

  const handleGameStart = () => {
    setQuestionSet(inputNumber);
    setGameStarted(true);
  };

  // Render
  return (
    <section className='home background'>
      <Container>
        <Row>
          <Col>
            <div className='home-control'>
              <div style={{ maxWidth: '320px', margin: 'auto' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '0.8rem',
                    borderRadius: '10px',
                  }}>
                  <p className='text-light d-flex align-items-center justify-content-center'>
                    Seja bem vindo ao Show do Milão!
                  </p>
                </div>
                <Row className="justify-content-center align-items-center">
                  <Col xs={4} md={5} className="question-col">
                    <div className="question-text">Question Set</div>
                  </Col>
                  <Col xs={4} md={3} className="question-col">
                    <Form.Control
                      type="number"
                      value={inputNumber}
                      min={0}
                      onChange={(e) => setInputNumber(parseInt(e.target.value))}
                      className="question-input"
                    />
                  </Col>
                </Row>
                <button onClick={() => handleGameStart()} className='btn'>
                  Começar
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Home;
