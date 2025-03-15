import React, { useState, useEffect, Fragment } from 'react';

import classnames from 'classnames';
import confetti from 'canvas-confetti';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { questionDB0, extraQuestionDB0, rewardPerLevel0, rewardType0, randomQuestion0 } from '../../data/test-questions/questionset0';
import { questionDB1, extraQuestionDB1, rewardPerLevel1, rewardType1, randomQuestion1 } from '../../data/test-questions/questionset1';
import { questionDB2, extraQuestionDB2, rewardPerLevel2, rewardType2, randomQuestion2 } from '../../data/test-questions/questionset2';

import './Game.css';
import logo from './logo.png';
import UnclosableModal from '../../components/UnclosableModal';
import CardModal from '../../components/cards/CardModal';
import { useQuestionSetContext } from '../../context/QuestionSetProvider';
import AnimatedText from '../../components/text/AnimatedText';

const Game = ({ setGameStarted }) => {
  const { questionSet } = useQuestionSetContext();
  // States
  const [easyQuestions, setEasyQuestions] = useState(null);
  const [mediumQuestions, setMediumQuestions] = useState(null);
  const [hardQuestions, setHardQuestions] = useState(null);

  const [extraEasyQuestions, setExtraEasyQuestions] = useState(null);
  const [extraMediumQuestions, setExtraMediumQuestions] = useState(null);
  const [extraHardQuestions, setExtraHardQuestions] = useState(null);

  const [rewardPerLevel, setRewardPerLevel] = useState(null);
  const [rewardType, setRewardType] = useState(null);

  const [randomQuestion, setRandomQuestion] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  const [timerStart, setTimerStart] = useState(null);
  const [counterStart, setCounterStart] = useState(1);

  const [timerQuestion, setTimerQuestion] = useState(null);
  const [counterQuestion, setCounterQuestion] = useState(30);

  const [showModal, setShowModal] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [answerHighlight, setAnswerHighlight] = useState(false);
  const [wrongSelectedAnswer, setWrongSelectedAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(5);

  const [skipAvailable, setSkipAvailable] = useState(3);
  const [cardsAvailable, setCardsAvailable] = useState(true);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [hiddenAnswerList, setHiddenAnswerList] = useState([false, false, false, false]);
  const [helpAvailable, setHelpAvailable] = useState(true);
  const [callAvailable, setCallAvailable] = useState(true);

  const [visibleTextIndex, setVisibleTextIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const setQuestionsAndRewards = () => {
    var questions = [];
    var extraQuestions = [];
    if (questionSet === 0){
      questions = [...questionDB0];
      extraQuestions = [...extraQuestionDB0];
      setRewardPerLevel(rewardPerLevel0);
      setRewardType(rewardType0);
      setRandomQuestion(randomQuestion0);
    }
    else if (questionSet === 1){
      questions = [...questionDB1];
      extraQuestions = [...extraQuestionDB1];
      setRewardPerLevel(rewardPerLevel1);
      setRewardType(rewardType1);
      setRandomQuestion(randomQuestion1);
    } else {
      questions = [...questionDB2];
      extraQuestions = [...extraQuestionDB2];
      setRewardPerLevel(rewardPerLevel2);
      setRewardType(rewardType2);
      setRandomQuestion(randomQuestion2);
    }

    // Regular questions
    var easyQuestions = [];
    var mediumQuestions = [];
    var hardQuestions = [];
    questions.forEach(question => {
      if(question.difficulty === 0){
        easyQuestions.push(question);
      }
      else if(question.difficulty === 1) {
        mediumQuestions.push(question);
      }
      else {
        hardQuestions.push(question);
      }
    });

    setEasyQuestions(easyQuestions);
    setMediumQuestions(mediumQuestions);
    setHardQuestions(hardQuestions);

    // Extra questions
    var extraEasyQuestions = [];
    var extraMediumQuestions = [];
    var extraHardQuestions = [];
    extraQuestions.forEach(question => {
      if(question.difficulty === 0){
        extraEasyQuestions.push(question);
      }
      else if(question.difficulty === 1) {
        extraMediumQuestions.push(question);
      }
      else {
        extraHardQuestions.push(question);
      }
    });

    setExtraEasyQuestions(extraEasyQuestions);
    setExtraMediumQuestions(extraMediumQuestions);
    setExtraHardQuestions(extraHardQuestions);
  };

  const getNextQuestion = (currentLevel, isExtraQuestion) => {
    let questionsArr, question, questionIndex;
    if (currentLevel < 3) {
      questionsArr = isExtraQuestion ? [...extraEasyQuestions] : [...easyQuestions];
      questionIndex = randomQuestion ? Math.floor(Math.random() * questionsArr.length) : 0;
      question = questionsArr.splice(questionIndex, 1)[0];
      if(isExtraQuestion)
      {
        setExtraEasyQuestions(questionsArr);
      }
      else {
        setEasyQuestions(questionsArr);
      }
    } else if (currentLevel < 6) {
      questionsArr = isExtraQuestion ? [...extraMediumQuestions] : [...mediumQuestions];
      questionIndex = randomQuestion ? Math.floor(Math.random() * questionsArr.length) : 0;
      question = questionsArr.splice(questionIndex, 1)[0];
      if(isExtraQuestion)
      {
        setExtraMediumQuestions(questionsArr);
      }
      else {
        setMediumQuestions(questionsArr);
      }
    } else if (currentLevel < 10) {
      questionsArr = isExtraQuestion ? [...extraHardQuestions] : [...hardQuestions];
      questionIndex = randomQuestion ? Math.floor(Math.random() * questionsArr.length) : 0;
      question = questionsArr.splice(questionIndex, 1)[0];
      if(isExtraQuestion)
      {
        setExtraHardQuestions(questionsArr);
      }
      else {
        setHardQuestions(questionsArr);
      }
    }
    setCurrentQuestion(question);
  };

  const startTimerQuestion = () => {
    clearInterval(timerQuestion);
    setCounterQuestion(30);
    if(parseInt(process.env.REACT_APP_QUESTION_TIMER) !== 0)
    {
      setTimerQuestion(
        setInterval(() => {
          setCounterQuestion((c) => c - 1);
        }, 1000)
      );
    }
  };

  useEffect(() => {
    setQuestionsAndRewards();
    setCurrentLevel(0);
    setTimerStart(
      setInterval(() => {
        setCounterStart((c) => c - 1);
      }, 1000)
    );
  }, []);

  useEffect(() => {
    if (counterStart === 0) {
      clearInterval(timerStart);
      getNextQuestion(currentLevel, false);
      startTimerQuestion();
    }
  }, [counterStart]);

  useEffect(() => {
    if (counterQuestion === 0) {
      clearInterval(timerQuestion);
      setShowModal(true);
    }
  }, [counterQuestion]);

  const levelUp = () => {
    if (currentLevel === rewardPerLevel.length - 1) {
      setShowModal(true);
      setGameWon(true);
      confetti({
        particleCount: 200,
      });
    } else {
      setVisibleTextIndex(-1);
      setCurrentLevel((c) => c + 1);
      getNextQuestion(currentLevel, false);
      startTimerQuestion();
    }
  };

  const answerQuestion = (answer) => {
    if(selectedAnswer === answer)
    {
      setSelectedAnswer(5);
      clearInterval(timerQuestion);
      const highlightInterval = setInterval(() => {
        setAnswerHighlight((r) => !r);
      }, 80);
      if (currentQuestion.answer === answer) {
        setTimeout(() => {
          clearInterval(highlightInterval);
          setAnswerHighlight(false);
          setHiddenAnswerList([false, false, false, false])
          levelUp();
        }, 1500);
      } else {
        setWrongSelectedAnswer(answer);
        setTimeout(() => {
          clearInterval(highlightInterval);
          setAnswerHighlight(false);
          setHiddenAnswerList([false, false, false, false])
          setGameOver(true);
          setShowModal(true);
        }, 1500);
      }
    }
    else {
      setSelectedAnswer(answer);
    }
  };

  const skipQuestion = () => {
    setSkipAvailable((p) => p - 1);
    setVisibleTextIndex(-1);
    getNextQuestion(currentLevel, true);
    startTimerQuestion();
  };

  const showCards = () => {
    setCardModalOpen(true);
    setCardsAvailable(false);
  }

  const onCardSelected = (index) => {
    var removeAnswers = index + 1;
    var newHiddenAnswerList = hiddenAnswerList;
    while(removeAnswers !== 0){
      var randomAnswerIndex = Math.floor(Math.random() * 4);
      if(randomAnswerIndex !== parseInt(currentQuestion.answer) && !newHiddenAnswerList[randomAnswerIndex]){
        newHiddenAnswerList[randomAnswerIndex] = true;
        removeAnswers--;
      }
    }
    setHiddenAnswerList(newHiddenAnswerList);
    setTimeout(() => {
      setCardModalOpen(false);
    }, 3000);
  }

  // Handle click event
  const handleClick = () => {
    if (visibleTextIndex < 4) {
      setVisibleTextIndex(visibleTextIndex + 1);
    }
    if (visibleTextIndex < 4 && !isAnimating) {
      setIsAnimating(true);
      const newIndex = visibleTextIndex + 1;
      setVisibleTextIndex(newIndex);
      //setVisibleTexts((prev) => [...prev, texts[newIndex]]);
    }
  };

  // Render
  return (
    <section className='game background' onClick={handleClick}>
      <UnclosableModal
        title={
          counterQuestion === 0
            ? 'Tempo esgotado'
            : gameOver
            ? 'Resposta errada'
            : gameWon
            ? 'Você ganhou!!'
            : ''
        }
        show={showModal}
        setShow={setShowModal}>
        <p>
          {counterQuestion === 0 &&
            `Sinto muito, o seu tempo acabou. A opção certa era ${
              currentQuestion.answers[parseInt(currentQuestion.answer)]
            }.`}
          {gameOver &&
            `A answer está e... rrada. A opção certa era ${
              currentQuestion.answers[parseInt(currentQuestion.answer)]
            }.`}
          {gameWon && (
            <Fragment>
              { 'Parabéns!!! Você ganhou' + 
                rewardType === 'money' ? 
                  <strong>1 MILÃO DE REAIS</strong> + '!' :
                  <strong>{rewardPerLevel[rewardPerLevel.length-1]}</strong> + "!"
              }
            </Fragment>
          )}
        </p>
        {(counterQuestion === 0 || gameOver) && (
          <p>
            Você ganhou{' '}
            <strong>
              { rewardType === 'money' ? 
                  (currentLevel === 0
                    ? '0'
                    : `${(rewardPerLevel[currentLevel] / 2).toString()}` + ' reais') :
                    (currentLevel === 0
                      ? 'Nada'
                      : (rewardPerLevel[currentLevel - 1]) + '')
              }
              
              
            </strong>
            ! Ma oeee, senta lá!
          </p>
        )}

        <div className='text-center mt-5'>
          <Button
            className='btn btn-primary'
            onClick={() => {
              setGameStarted(false);
            }}>
            Jogar novamente
          </Button>
        </div>
      </UnclosableModal>
      <CardModal
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        onCardSelected={onCardSelected}
      />
      {parseInt(process.env.REACT_APP_QUESTION_TIMER !== 0) ? 
        <div className='timer-question'>{counterQuestion}</div> : <></>
      }
      <Container className='py-4'>
        <Row>
          <Col>
            <div className='game-control text-center'>
              <img src={logo} alt='logo-show-do-milhao img-fluid' style={{ maxWidth: '240px' }} />
              {counterStart === 0 && (
                <div className='contador-questions'>
                  <p className='text-light'>PERGUNTA NÚMERO {currentLevel + 1}</p>
                </div>
              )}
              <div className='question'>
                {visibleTextIndex >= 0 && (
                  <AnimatedText
                    className='m-0'
                    key={0}
                    text={counterStart !== 0 ? '' : currentQuestion && currentQuestion.question}
                    onAnimationEnd={() => setIsAnimating(false)}
                  />
                )}
              </div>

              {counterStart === 0 && currentQuestion && (
                <Fragment>
                  <div className='text-center'>
                    {currentQuestion.answers.map((alternativa, i) => (
                      <Row
                      hidden={hiddenAnswerList[i]}
                        onClick={() => {
                          answerQuestion(i);
                        }}
                        className={classnames('alternativa', {
                          correct: i === parseInt(currentQuestion.answer),
                          wrong: i === parseInt(wrongSelectedAnswer),
                          selected: i === parseInt(selectedAnswer),
                          highlight: answerHighlight,
                        })}
                        key={i}>
                        <Col xs='auto' className='numero-alternativa'>
                          {i + 1}
                        </Col>
                        <Col>
                          {visibleTextIndex >= i + 1 && (
                            <AnimatedText
                              className='m-0'
                              key={i+1}
                              text={alternativa}
                              onAnimationEnd={() => setIsAnimating(false)}
                            />
                          )}
                          {}
                        </Col>
                      </Row>
                    ))}
                  </div>

                  <Row className='mt-5'>
                    <Col xs='auto' className='mx-auto'>
                      <div className='text-center opcoes'>
                        {skipAvailable > 0 && (
                          <div className='opcao' onClick={skipQuestion}>
                            PULAR ({skipAvailable})
                          </div>
                        )}
                      </div>
                      <div className='text-center opcoes'>
                        {cardsAvailable && (
                          <div className='opcao' onClick={showCards}>
                            CARTAS
                          </div>
                        )}
                      </div>
                      <div className='text-center opcoes'>
                        {helpAvailable && (
                          <div className='opcao' onClick={() => setHelpAvailable(false)}>
                            AJUDA
                          </div>
                        )}
                      </div>
                      <div className='text-center opcoes'>
                        {callAvailable && (
                          <div className='opcao' onClick={() => setCallAvailable(false)}>
                            LIGAÇÃO
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row className='mt-5'>
                    <Col xs='auto' className='mx-auto'>
                      <div className='text-center projecoes'>
                        <div className='valor'>
                          {currentLevel < rewardPerLevel.length
                          ? ( rewardType === 'money' ?
                            (rewardPerLevel[currentLevel] / 2).toString() :
                            ( currentLevel === 0 ? 'Nada' : rewardPerLevel[currentLevel - 1])
                          )
                          : ''
                        }
                        </div>
                        <p className='opcao'>ERRAR</p>
                      </div>
                      <div className='text-center projecoes'>
                        <div className='valor'>
                          { currentLevel === 0 || currentLevel >= rewardPerLevel.length ?
                            ( rewardType === 'money' ?
                              '0' :
                              'Nada') :
                            ( rewardType === 'money' ?
                                (rewardPerLevel[currentLevel]).toString() :
                                rewardPerLevel[currentLevel]
                            )}
                        </div>
                        <p
                          className='opcao'
                          onClick={() => {
                            if (
                              window.confirm(
                                `Tem certeza de que deseja parar?
                                Você ganhará ${rewardPerLevel[currentLevel]
                                  .toString()} reais.`
                              )
                            )
                              setGameStarted(false);
                          }}>
                          PARAR
                        </p>
                      </div>
                      <div className='text-center projecoes'>
                        <div className='valor'>
                          { currentLevel + 1 < rewardPerLevel.length
                            ? rewardPerLevel[currentLevel + 1].toString()
                            : '1 MILÃO'
                          }
                        </div>
                        <p className='opcao'>ACERTAR</p>
                      </div>
                    </Col>
                  </Row>
                </Fragment>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Game;
