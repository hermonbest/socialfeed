const TELEGRAM_BOT_TOKEN = '__TELEGRAM_BOT_TOKEN__';
const TELEGRAM_CHAT_ID = '__TELEGRAM_CHAT_ID__';

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

function formatPrice(price, currency) {
  if (currency === 'ETB') {
    return `${(price / 1000).toFixed(0)}K ብር (${price.toLocaleString()} ETB)`;
  }
  return `$${price}`;
}

function formatOrderCaption(order) {
  const lines = [
    '📸 *አዲስ የቦታ ማስያዣ ትዕዛዝ!*',
    '',
    `*ፓኬጅ፡* ${order.packageTitle}`,
    `*ዋጋ፡* ${formatPrice(order.price, order.currency)}`,
    `*ቆይታ፡* ${order.duration}`,
    '',
    '--- *የደንበኛ ዝርዝሮች* ---',
    `*ስም፡* ${order.fullName}`,
    `*ስልክ፡* ${order.phoneNumber}`,
    `*ኢሜይል፡* ${order.email}`,
    `*ቀን፡* ${order.preferredDate}`,
    `*ሰዓት፡* ${order.preferredTime}`,
    '',
    '--- *ክፍያ* ---',
    `*ዘዴ፡* ${order.paymentMethod || 'አልተገለጸም'}`,
    `*መለያ፡* ${order.paymentAccount || 'የለም'}`,
    '',
    `*የገባበት፡* ${new Date().toLocaleString()}`,
  ];

  return lines.join('\n');
}

export async function sendTelegramNotification(order, imageUri) {
  try {
    const caption = formatOrderCaption(order);

    if (imageUri) {
      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('photo', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'payment_screenshot.jpg',
      });
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');

      const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (!data.ok) {
        console.warn('Telegram photo notification failed:', data.description);
        return false;
      }

      return true;
    }

    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: caption,
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
        subject: 'አዲስ የስቱዲዮ ቦታ ማስያዣ ትዕዛዝ',
        message: formatOrderCaption(order),
        ...order,
      }),
    });

    return response.ok;
  } catch (error) {
    console.warn('Email notification error:', error.message);
    return false;
  }
}
