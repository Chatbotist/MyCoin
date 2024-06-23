let balance = 0;
let level = 1;
let pointsToNextLevel = 1000;
let coinImage = 'LeadtexCoin.png';
let telegramId = null;

function vibrateOnClick() {
  if ("vibrate" in navigator) {
    window.navigator.vibrate(100); // Короткая вибрация на 100 миллисекунд
  }
}

function incrementScore(event) {
  balance++;
  document.getElementById('balance').textContent = 'Баллы: ' + balance;
  showClickAnimation(event.clientX, event.clientY);
  checkLevelUp();
  updateProgressBar();
  saveGameState();
}

function showClickAnimation(x, y) {
  const clickText = document.createElement('div');
  clickText.textContent = '+1';
  clickText.className = 'click-animation';
  clickText.style.left = `${x}px`;
  clickText.style.top = `${y}px`;
  document.body.appendChild(clickText);
  setTimeout(() => {
    clickText.remove();
  }, 1000);
}

function checkLevelUp() {
  if (balance >= pointsToNextLevel) {
    level++;
    balance = balance; // Баллы не обнуляются, продолжают копиться
    pointsToNextLevel = Math.floor(pointsToNextLevel * 1.5);
    document.getElementById('level').textContent = 'Уровень: ' + level;
    document.getElementById('balance').textContent = 'Баллы: ' + balance;
    updateProgressBar(true); // Обнуляем прогресс бар
  }
}

function updateProgressBar(reset = false) {
  const progress = reset ? 0 : Math.min((balance / pointsToNextLevel) * 100, 100);
  document.getElementById('progress').style.width = progress + '%';
}

function showCoin() {
  setActiveButton('coinButton');
  alert('Coin button clicked');
}

function showUp() {
  setActiveButton('upButton');
  alert('Up button clicked');
}

function showTask() {
  setActiveButton('taskButton');
  alert('Task button clicked');
}

function showTop() {
  setActiveButton('topButton');
  alert('Top button clicked');
}

function setActiveButton(buttonId) {
  document.querySelectorAll('.menu button').forEach(button => {
    button.classList.remove('active');
  });
  document.getElementById(buttonId).classList.add('active');
}

function saveGameState() {
  const gameState = {
    balance: balance,
    level: level,
    pointsToNextLevel: pointsToNextLevel,
    coinImage: coinImage
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
  const gameState = JSON.parse(localStorage.getItem('gameState'));
  if (gameState) {
    balance = gameState.balance;
    level = gameState.level;
    pointsToNextLevel = gameState.pointsToNextLevel;
    coinImage = gameState.coinImage;
    document.getElementById('balance').textContent = 'Баллы: ' + balance;
    document.getElementById('level').textContent = 'Уровень: ' + level;
    document.getElementById('coin').style.backgroundImage = `url(${coinImage})`;
    updateProgressBar();
  }
}

function fetchInitialBalance(telegramId) {
  const webhookUrl = 'https://hook.eu2.make.com/3cn7hflf2x478ihdcm38gjgw2rbu5ioa';

  fetch(webhookUrl, {
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
    if (data && data.data && data.data[0] && data.data[0].balance !== undefined) {
      const initialBalance = data.data[0].balance;
      setInitialBalance(initialBalance);
    } else {
      alert('Ошибка получения данных: ' + JSON.stringify(data));
    }
  })
  .catch(error => {
    alert('Ошибка: ' + error);
  });
}

function setInitialBalance(initialBalance) {
  balance = initialBalance;
  document.getElementById('balance').textContent = 'Баллы: ' + balance;
  updateProgressBar();
}

if (window.Telegram && window.Telegram.WebApp) {
  // Устанавливаем цвет фона веб-приложения
  window.Telegram.WebApp.setBackgroundColor("#2E3E54"); // Цвет фона приложения

  // Устанавливаем цвет заголовка веб-приложения
  window.Telegram.WebApp.setHeaderColor("#182A42"); // Цвет заголовка

  Telegram.WebApp.expand();
  Telegram.WebApp.enableClosingConfirmation();
  const initDataUnsafe = Telegram.WebApp.initDataUnsafe;
  if (initDataUnsafe && initDataUnsafe.user) {
    telegramId = initDataUnsafe.user.id;
    fetchInitialBalance(telegramId);
    window.Telegram.WebApp.MainButton.setParams({
      text: "Закрыть",
      color: "#2C2F36", // Цвет главной кнопки телеграм
      text_color: "#FFFFFF"
    });
    window.Telegram.WebApp.MainButton.show();
    window.Telegram.WebApp.MainButton.onClick(function() {
      const url = `https://app.leadteh.ru/w/bQ300?utm_campaign=${balance}`;
      window.Telegram.WebApp.openLink(url);
      window.Telegram.WebApp.close();
    });
  } else {
    alert("initDataUnsafe.user is undefined");
  }
} else {
  alert("Telegram Web App not detected");
}

function handleTouchStart(event) {
  event.preventDefault();
  const coin = document.getElementById('coin');
  const rect = coin.getBoundingClientRect();
  const touch = event.touches[0]; // Берем только первый палец
  if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
    incrementScore(touch);
    vibrateOnClick();
    coin.classList.add('active');
    setTimeout(() => coin.classList.remove('active'), 50);
  }
}

function handleMouseDown(event) {
  event.preventDefault();
  const coin = document.getElementById('coin');
  const rect = coin.getBoundingClientRect();
  if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
    incrementScore(event);
    vibrateOnClick();
    coin.classList.add('active');
    setTimeout(() => coin.classList.remove('active'), 50);
  }
}

document.getElementById('coin').addEventListener('mousedown', handleMouseDown);
document.getElementById('coin').addEventListener('touchstart', handleTouchStart);

// Загрузка состояния игры при загрузке страницы
window.addEventListener('load', function() {
  const coin = document.getElementById('coin');
  coin.style.backgroundImage = 'url("LeadtexCoin.png")';
  loadGameState();
});

// Блокировка закрытия окна смахиванием вниз и постоянное разворачивание
if (window.Telegram && window.Telegram.WebApp) {
  Telegram.WebApp.onEvent('viewportChanged', function(height) {
    if (height < window.innerHeight) {
      Telegram.WebApp.expand();
    }
  });

  // Проверка развертывания при загрузке страницы
  var isExpanded = window.Telegram.WebApp.isExpanded;
  console.log("Развернуто на весь экран:", isExpanded);

  var viewportHeight = window.Telegram.WebApp.viewportHeight;
  console.log("Высота видимой области:", viewportHeight);

  if (viewportHeight < window.innerHeight) {
    Telegram.WebApp.expand();
  }
}

// Запрещаем увеличение масштаба жестами
document.addEventListener('gesturestart', function(event) {
  event.preventDefault();
});

// Автоматическая адаптация под любой экран, с сохранением пропорций
function resizeGame() {
  const container = document.querySelector('.container');
  const aspectRatio = 16 / 9; // Примерное соотношение сторон
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (windowWidth / windowHeight < aspectRatio) {
    container.style.width = '100%';
    container.style.height = 'auto';
  } else {
    container.style.width = 'auto';
    container.style.height = '100%';
  }
}

window.addEventListener('resize', resizeGame);
resizeGame();
