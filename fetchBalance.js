<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Кликер Монета</title>
<meta name="description" content="Игра Кликер Монета - нажимай на монету и зарабатывай очки!">
<meta name="keywords" content="игра, кликер, монета, Telegram, Web App">
<meta name="author" content="Ваше Имя">
<style>
  body {
    text-align: center;
    font-family: Arial, sans-serif;
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: url('LeadtexFon.png') no-repeat center center fixed;
    background-size: cover;
    color: white;
  }
  .coin {
    width: 300px;
    height: 300px;
    background: url('LeadtexCoin.png') no-repeat center center;
    background-size: contain;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 120px;
    transition: transform 0.1s;
    user-select: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  .coin:active {
    transform: scale(0.96);
    transition: transform 0.05s;
  }
  #balance {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    z-index: 10;
    color: white;
  }
  #user-info {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 18px;
    color: white;
  }
</style>
</head>
<body>

<div id="user-info">ID: <span id="userId"></span><br>Username: <span id="username"></span></div>
<div class="coin" onclick="incrementScore()"></div>
<div id="balance">💲 0</div>

<script src="https://telegram.org/js/telegram-web-app.js"></script>
<script>
let balance = 0;

function vibrateOnClick() {
  if ("vibrate" in navigator) {
    window.navigator.vibrate(100);
  }
}

function incrementScore() {
  balance++;
  document.getElementById('balance').textContent = '💲' + balance;
  vibrateOnClick();
}

function setInitialBalance(initialBalance) {
  balance = initialBalance;
  document.getElementById('balance').textContent = '💲' + balance;
}

function fetchInitialBalance(telegramId) {
  const serverlessFunctionUrl = '/fetchBalance';

  fetch(serverlessFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      telegram_id: telegramId
    })
  })
  .then(response => response.json())
