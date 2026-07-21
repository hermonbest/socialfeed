const TELEGRAM_BOT_TOKEN = '__TELEGRAM_BOT_TOKEN__';
const TELEGRAM_CHAT_ID = '__TELEGRAM_CHAT_ID__';

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

function formatPrice(price, currency) {
  if (currency === 'ETB') {
    return `${(price / 1000).toFixed(0)}K Birr (${price.toLocaleString()} ETB)`;
  }
  return `$${price}`;
}

function formatOrderMessage(order) {
  const lines = [
    '📸 *New Booking Order!*',
    '',
    `*Package:* ${order.packageTitle}`,
    `*Price:* ${formatPrice(order.price, order.currency)}`,
    `*Duration:* ${order.duration}`,
    '',
    '--- *Customer Details* ---',
    `*Name:* ${order.fullName}`,
    `*Phone:* ${order.phoneNumber}`,
    `*Email:* ${order.email}`,
    `*Date:* ${order.preferredDate}`,
    `*Time:* ${order.preferredTime}`,
    '',
    '--- *Payment* ---',
    `*Method:* ${order.paymentMethod || 'Not specified'}`,
    `*Account:* ${order.paymentAccount || 'N/A'}`,
    '',
    `*Submitted:* ${new Date().toLocaleString()}`,
  ];

  return lines.join('\n');
}

export async function sendTelegramNotification(order) {
  try {
    const message = formatOrderMessage(order);

    const response = await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.warn('Telegram notification failed:', data.description);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Telegram notification error:', error.message);
    return false;
  }
}

export async function sendEmailNotification(order) {
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'New Studio Booking Order',
        message: formatOrderMessage(order),
        ...order,
      }),
    });

    return response.ok;
  } catch (error) {
    console.warn('Email notification error:', error.message);
    return false;
  }
}
