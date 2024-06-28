const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/getUserData', async (req, res) => {
  try {
    const response = await fetch('https://app.leadteh.ru/api/v1/getListItems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        api_token: 'DOlW2wu8eIkzv2eu5yONxq2SUHrSXlLvRrbsRgDjBjzENmPI2vZpDyIKC6kb',
        schema_id: '66766a7ee60a49ba79057c62'
      })
    });
    const data = await response.json();
    res.json({ data: data.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.post('/api/getUserDataByTelegramId', async (req, res) => {
  const { telegram_id } = req.query;
  try {
    const response = await fetch(`https://app.leadteh.ru/api/v1/getListItems?api_token=DOlW2wu8eIkzv2eu5yONxq2SUHrSXlLvRrbsRgDjBjzENmPI2vZpDyIKC6kb&schema_id=66766a7ee60a49ba79057c62&filters[tg_id]=${telegram_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    const data = await response.json();
    res.json({ data: data.data[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data by Telegram ID' });
  }
});

app.post('/api/updateUserData', async (req, res) => {
  const { item_id, data } = req.body;
  try {
    const response = await fetch('https://app.leadteh.ru/api/v1/updateListItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        api_token: 'DOlW2wu8eIkzv2eu5yONxq2SUHrSXlLvRrbsRgDjBjzENmPI2vZpDyIKC6kb',
        schema_id: '66766a7ee60a49ba79057c62',
        item_id: item_id,
        data: data
      })
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
