# Millionaire show - Portfolio

Basic React and Next app simulating "Show do Milhão", a famous brazilian TV show similar to "Who Wants to Be a Millionaire".

## Local Installation

Use the package manager [npm](https://www.npmjs.com/) to install show-do-milhao.

```bash
git clone https://github.com/igorschechtel/show-do-milhao.git
cd show-do-milhao
npm install
npm start
```

## Components

### App

Keeps the state `gameStarted` - if false shows component `Home`, otherwise shows `Game`.

### Home

Just a home page with general information about the project and a button to start the game.

### Game

The game page, where the states and controls are and the game view is generated.

## License

[MIT](https://choosealicense.com/licenses/mit/)
