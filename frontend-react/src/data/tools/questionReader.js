'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', (inputStdin) => {
  inputString += inputStdin;
});

process.stdin.on('end', function () {
  inputString = inputString
    .replace(/\s*$/, '')
    .split('\n')
    .map((str) => str.replace(/\s*$/, ''));

  main();
});

function readLine() {
  return inputString[currentLine++];
}

function whichIsIt(inputLine) {
  // se a linha possui apenas números, pula
  if (/^\d+$/.test(inputLine)) {
    return 'SKIP';
  }
  // se a primeira palavra é numero, reconhece como answer
  if (/^\d+$/.test(inputLine.split(' ')[0])) {
    return 'ALTERNATIVA';
  }
  // se nao for lixo nem answer, é question
  return 'PERGUNTA';
}

function main() {
  let questionsCounter = 0;

  const questions = [];
  let inputLine = '';
  let question = '';
  const questionsWithAnswers = [];

  // pula linhas até o inicio das questions
  while ((inputLine = readLine()) !== 'Fácil') {
    continue;
  }

  // começa a ler questions (e identificar o que é)
  while ((inputLine = readLine()) !== undefined && questionsCounter < 300) {
    if (whichIsIt(inputLine) === 'SKIP') {
      question = '';
      continue;
    } else if (whichIsIt(inputLine) === 'PERGUNTA') {
      question = question.concat(' ' + inputLine);
    } else if (whichIsIt(inputLine) === 'ALTERNATIVA') {
      const answer1 = inputLine.split(' ').splice(1).join(' ');
      const answer2 = readLine().split(' ').splice(1).join(' ');
      const answer3 = readLine().split(' ').splice(1).join(' ');
      const answer4 = readLine().split(' ').splice(1).join(' ');

      questions.push({
        question: question,
        answers: [answer1, answer2, answer3, answer4],
      });

      question = '';
      questionsCounter++;
    }
  }

  // pula linhas até o inicio das answers
  while ((inputLine = readLine()) !== 'Quadro de Respostas') {
    continue;
  }

  // lê e guarda answers
  let answersCounter = 0;
  while ((inputLine = readLine()) !== undefined && answersCounter < 300) {
    let answer = inputLine.split('.................');
    if (answer.length > 1) {
      const index = parseInt(answer[0]);
      const ans = answer[1].replace(/\./g, '');

      let dificuldade;
      if (index < 100) dificuldade = 'Fácil';
      else if (index < 200) dificuldade = 'Média';
      else dificuldade = 'Difícil';

      questionsWithAnswers.push({
        ...questions[index - 1],
        answer: +ans,
        dificuldade,
      });
      answersCounter++;
    }
  }

  // escreve o resultado
  console.log('const questions = [');
  questionsWithAnswers.forEach((question) => {
    console.log(' {');
    console.log(`   "question": "${question.question.trim()}",`);
    console.log(`   "answers": [`);
    question.answers.forEach((answer, i) => {
      console.log(`     "${answer}",`);
    });
    console.log('   ],');
    console.log(`   "dificuldade": "${question.dificuldade}",`);
    console.log(`   "answer": "${question.answer}"`);
    console.log(` },`);
  });
  console.log(']');

  return 0;
}
