// api/fetchBalance.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { telegram_id } = req.body;

    // URL вебхука
    const webhookUrl = 'https://hook.eu2.make.com/3cn7hflf2x478ihdcm38gjgw2rbu5ioa';

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegram_id })
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка выполнения запроса' });
    }
  } else {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}
