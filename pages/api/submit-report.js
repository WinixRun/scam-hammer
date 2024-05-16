// src/pages/api/submit-report.js
import { json } from 'astro/runtime/server';

export async function post({ request }) {
  const data = await request.json();

  try {
    const response = await fetch('https://tu-backend.com/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return json({ message: 'Reporte enviado exitosamente' }, { status: 200 });
    } else {
      return json(
        { message: 'Hubo un problema al enviar el reporte' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error al enviar el reporte:', error);
    return json(
      { message: 'Hubo un problema al enviar el reporte' },
      { status: 500 }
    );
  }
}
