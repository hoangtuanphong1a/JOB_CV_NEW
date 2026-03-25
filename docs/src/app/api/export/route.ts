import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(request: NextRequest) {
  let browser;
  try {
    const { html, type, width = 794, height = 1123 } = await request.json();

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // ✅ FIX 2: Launch browser với Playwright
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewportSize({ width, height });

    // ✅ FIX: Set HTML content - chỉ remove margin/padding của container, giữ lại của elements
    const fullHtml = `
      <!DOCTYPE html>
      <html style="margin: 0; padding: 0;">
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            html, body { 
              width: ${width}px !important; 
              height: ${height}px !important; 
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden;
              box-sizing: border-box;
            }
            body {
              background: white;
              font-family: system-ui, -apple-system, sans-serif;
            }
            [data-canvas-content] {
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              box-sizing: border-box;
              width: ${width}px !important;
              max-width: ${width}px !important;
              overflow: hidden !important;
            }
            /* ✅ FIX: Giữ lại margin/padding của các phần tử bên trong */
            [data-canvas-content] > * {
              box-sizing: border-box;
              max-width: 100% !important;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500); // Wait for styles to apply

    let result: Buffer;

    if (type === 'pdf') {
      // ✅ FIX 1: Export PDF - không có margin, full A4
      result = await page.pdf({
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        preferCSSPageSize: false,
      });
    } else {
      // ✅ FIX: Export PNG - clip đúng kích thước để không có khoảng trắng
      const canvasElement = await page.$('[data-canvas-content]');
      if (canvasElement) {
        result = await canvasElement.screenshot({
          type: 'png',
        });
      } else {
        result = await page.screenshot({
          type: 'png',
          clip: { x: 0, y: 0, width, height },
        });
      }
    }

    await browser.close();

    return new NextResponse(result, {
      headers: {
        'Content-Type': type === 'pdf' ? 'application/pdf' : 'image/png',
        'Content-Disposition': `attachment; filename="design.${type === 'pdf' ? 'pdf' : 'png'}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

