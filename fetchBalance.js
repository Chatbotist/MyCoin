// fetchBalance.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { telegram_id } = req.body;

    // API URL
    const apiUrl = 'https://app.leadteh.ru/api/v1/getListItems';
    const lt_token = 'DOlW2wu8eIkzv2eu5yONxq2SUHrSXlLvRrbsRgDjBjzENmPI2vZpDyIKC6kb';
    const schema_id = '66766a7ee60a49ba79057c62';

    // Формируем данные для запроса
    const params = new URLSearchParams();
    params.append('api_token', lt_token);
    params.append('schema_id', schema_id);
    params.append('filters[tg_id]', telegram_id);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data && data.data && data.data[0] && data.data[0].balance !== undefined) {
          res.status(200).json({ balance: data.data[0].balance });
        } else {
          res.status(400).json({ error: 'Баланс не найден' });
        }
      } catch (jsonError) {
        res.status(500).json({ error: 'Ошибка парсинга JSON', details: text });
      }
    } catch (error) {
      res.status(500).json({ error: 'Ошибка выполнения запроса', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}
