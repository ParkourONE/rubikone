import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ConfiguratorData {
  contactName: string;
  email: string;
  orgType: string;
  orgName: string;
  orgSize: string;
  wantsConsultation: string;
  message: string;
  paket: {
    name: string;
    posts: number;
    basePrice: number;
  };
  services: {
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

export async function POST(request: Request) {
  try {
    const data: ConfiguratorData = await request.json();

    // Validate required fields
    if (!data.email) {
      return NextResponse.json(
        { error: 'E-Mail ist erforderlich.' },
        { status: 400 }
      );
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('de-CH', {
        style: 'currency',
        currency: 'CHF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

    // Build services list HTML
    const servicesHtml = data.services.length > 0
      ? data.services.map(s => `
          <tr>
            <td style="padding: 8px 10px; border-bottom: 1px solid #eee;">${s.name}</td>
            <td style="padding: 8px 10px; border-bottom: 1px solid #eee; text-align: right;">+${formatPrice(s.price)}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="2" style="padding: 8px 10px; color: #666;">Keine zusätzlichen Leistungen gewählt</td></tr>';

    // 1. Send notification to RubikONE team
    const { error: teamError } = await resend.emails.send({
      from: 'RubikONE Konfigurator <info@rubikone.ch>',
      to: 'info@rubikone.ch',
      replyTo: data.email,
      subject: `Neues Leistungspaket${data.orgName ? ` von ${data.orgName}` : ''}`,
      html: `
        <h2>Neues Leistungspaket über rubikone.ch</h2>

        <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 180px;">Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.contactName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">E-Mail</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Organisationseinheit</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.orgType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Bezeichnung</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.orgName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Grösse</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.orgSize}</td>
          </tr>
          ${data.wantsConsultation ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Beratungsgespräch</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.wantsConsultation}</td>
          </tr>
          ` : ''}
          ${data.message ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Anliegen / Fragen</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.message}</td>
          </tr>
          ` : ''}
        </table>

        <h3 style="margin-top: 30px;">Konfiguration</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr style="background: #f5f5f7;">
            <td style="padding: 10px; font-weight: bold;">Paket</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">${formatPrice(data.paket.basePrice)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.paket.name} (${data.paket.posts} Posten)</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"></td>
          </tr>
          <tr style="background: #f5f5f7;">
            <td colspan="2" style="padding: 10px; font-weight: bold;">Zusätzliche Leistungen</td>
          </tr>
          ${servicesHtml}
          <tr style="background: #1d1d1f; color: white;">
            <td style="padding: 12px; font-weight: bold;">Gesamtpreis (geschätzt)</td>
            <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px;">${formatPrice(data.totalPrice)}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          Diese Anfrage wurde über den Preiskonfigurator auf rubikone.ch gesendet.
        </p>
      `,
    });

    if (teamError) {
      console.error('Resend error (team notification):', teamError);
    }

    // 2. Send confirmation email to customer
    const { error: customerError } = await resend.emails.send({
      from: 'RubikONE <info@rubikone.ch>',
      to: data.email,
      subject: 'Ihr RubikONE Leistungspaket',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%);">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">RubikONE</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 10px 0 0 0;">Ihr Leistungspaket</p>
          </div>

          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; color: #1d1d1f; line-height: 1.6;">
              ${data.contactName ? `Guten Tag ${data.contactName},` : 'Vielen Dank für Ihr Interesse an RubikONE!'}
            </p>
            <p style="font-size: 16px; color: #666; line-height: 1.6;">
              Hier ist die Zusammenfassung Ihrer Konfiguration:
            </p>

            <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin: 30px 0;">
              <h3 style="margin: 0 0 16px 0; color: #1d1d1f; font-size: 18px;">${data.paket.name}</h3>
              <p style="margin: 0 0 8px 0; color: #666;">${data.paket.posts} Posten</p>
              <p style="margin: 0; color: #1d1d1f; font-weight: 600;">${formatPrice(data.paket.basePrice)}</p>
            </div>

            ${data.services.length > 0 ? `
            <div style="margin: 30px 0;">
              <h4 style="color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 16px 0;">Zusätzliche Leistungen</h4>
              ${data.services.map(s => `
                <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                  <span style="color: #1d1d1f;">${s.name}</span>
                  <span style="color: #666;">+${formatPrice(s.price)}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <div style="background: #1d1d1f; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: rgba(255,255,255,0.7); font-size: 14px;">Geschätzter Gesamtpreis</p>
              <p style="margin: 0; color: white; font-size: 32px; font-weight: 700;">${formatPrice(data.totalPrice)}</p>
            </div>

            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px;">
              <strong>Hinweis:</strong> Dies ist eine unverbindliche Schätzung. Der finale Preis hängt von den spezifischen Gegebenheiten vor Ort ab.
            </p>

            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
              <h4 style="color: #1d1d1f; margin: 0 0 16px 0;">Nächste Schritte</h4>
              <p style="font-size: 16px; color: #666; line-height: 1.6;">
                Wir empfehlen einen <strong>Impulsworkshop</strong>, um die Möglichkeiten in Ihrer Gemeinde vor Ort zu erkunden. In 2 Stunden zeigen wir Ihnen, was möglich ist.
              </p>
              <a href="https://rubikone.ch/impulsworkshop" style="display: inline-block; margin-top: 16px; padding: 14px 28px; background: #1d1d1f; color: white; text-decoration: none; border-radius: 50px; font-weight: 500;">
                Mehr zum Impulsworkshop →
              </a>
            </div>

            <div style="margin-top: 40px; padding: 24px; background: #f5f5f7; border-radius: 12px;">
              <h4 style="color: #1d1d1f; margin: 0 0 12px 0;">Kontakt</h4>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.8;">
                ParkourONE<br>
                E-Mail: <a href="mailto:info@rubikone.ch" style="color: #0066cc;">info@rubikone.ch</a><br>
                Telefon: <a href="tel:+41319712827" style="color: #0066cc;">+41 31 971 28 27</a>
              </p>
            </div>
          </div>

          <div style="text-align: center; padding: 30px 20px; background: #f5f5f7; color: #666; font-size: 12px;">
            <p style="margin: 0;">
              © ${new Date().getFullYear()} RubikONE by ParkourONE<br>
              <a href="https://rubikone.ch" style="color: #666;">rubikone.ch</a>
            </p>
          </div>
        </div>
      `,
    });

    if (customerError) {
      console.error('Resend error (customer confirmation):', customerError);
      return NextResponse.json(
        { error: 'Bestätigungs-E-Mail konnte nicht gesendet werden.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Configurator API error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
