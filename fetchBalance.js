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
  const serverlessFunctionUrl = '/fetchBalance'; // Обратите внимание на путь

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
  .then(data => {
    if (data && data.balance !== undefined) {
      setInitialBalance(data.balance);
      alert('Баланс успешно получен: ' + data.balance);
    } else {
      alert('Ошибка получения данных: ' + JSON.stringify(data));
    }
  })
  .catch(error => {
    alert('Ошибка: ' + error);
  });
}

if (window.Telegram && window.Telegram.WebApp) {
  alert("Telegram Web App detected");
  Telegram.WebApp.expand();
  Telegram.WebApp.enableClosingConfirmation();

  const initDataUnsafe = Telegram.WebApp.initDataUnsafe;
  alert("initDataUnsafe: " + JSON.stringify(initDataUnsafe));
  if (initDataUnsafe && initDataUnsafe.user) {
    const telegramId = initDataUnsafe.user.id;
    document.getElementById('userId').textContent = telegramId;
    document.getElementById('username').textContent = initDataUnsafe.user.username;

    fetchInitialBalance(telegramId);

    window.Telegram.WebApp.MainButton.setParams({
      text: "Закрыть",
      color: "rgb(77, 76, 76)",
      text_color: "#FFFFFF"
    });
    window.Telegram.WebApp.MainButton.show();

    window.Telegram.WebApp.MainButton.onClick(function() {
      save();
      window.navigator.vibrate(100);
      showConfirmationDialog();
    });
  } else {
    alert("initDataUnsafe.user is undefined");
  }
} else {
  alert("Telegram Web App not detected");
}

function save() {
  const initDataUnsafe = Telegram.WebApp.initDataUnsafe;
  const userid = initDataUnsafe.user.id;

  fetch('https://api.directual.com/good/api/v5/data/WebUser/saveBalance?appID=1e836900-e4dc-4f0c-b73d-fbd01d3ae652&sessionID=yourSessionID', {
    method: 'POST',
    body: JSON.stringify({
      'id': userid,
      'balance': balance
    }),
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.json())
    .then(data => {
      alert('Данные сохранены: ' + JSON.stringify(data));
    })
    .catch(error => {
      alert('Ошибка: ' + error);
    });
}

function showConfirmationDialog() {
  Telegram.WebApp.showConfirm("💾 Прогресс сохранён!\n\nХотите выйти из игры?", function(confirm) {
    if (confirm) {
      Telegram.WebApp.close();
    }
  });
}

window.addEventListener('beforeunload', function (e) {
  save();
});

document.querySelector('.coin').addEventListener('mousedown', function(e) {
  e.preventDefault();
});
</script>

</body>
</html>
