import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, gemeinde, nachricht } = await request.json();

    // Validate required fields
    if (!name || !email || !gemeinde) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Gemeinde sind erforderlich.' },
        { status: 400 }
      );
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'RubikONE Kontaktformular <onboarding@resend.dev>', // Change to noreply@rubikone.ch after domain verification
      to: 'info@rubikone.ch',
      replyTo: email,
      subject: `Neue Anfrage von ${name} (${gemeinde})`,
      html: `
        <h2>Neue Kontaktanfrage über rubikone.ch</h2>

        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">E-Mail</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Gemeinde</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${gemeinde}</td>
          </tr>
          ${nachricht ? `
          <tr>
            <td style="padding: 10px; font-weight: bold; vertical-align: top;">Nachricht</td>
            <td style="padding: 10px; white-space: pre-wrap;">${nachricht}</td>
          </tr>
          ` : ''}
        </table>

        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Diese Nachricht wurde über das Kontaktformular auf rubikone.ch gesendet.
        </p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'E-Mail konnte nicht gesendet werden.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
