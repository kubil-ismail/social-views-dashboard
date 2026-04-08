import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright-core";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const _username = body.username;

  let browser;

  try {
    browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      viewport: {
        width: 1280,
        height: 800,
      },
    });

    const page = await context.newPage();

    await page.goto(
      `https://inflact.com/instagram-viewer/?profile=${_username}`,
      {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      }
    );

    /* 1️⃣ Tunggu profile header */
    await page.waitForSelector("#instagram-downloader-profile");

    /* 2️⃣ Tunggu list post muncul */
    await page.waitForSelector(
      'div[class*="InstagramViewerPost-module__post"]'
    );

    /* 3️⃣ Kasih delay kecil untuk hydration / async render */
    await page.waitForTimeout(1500);

    const profile = await page.evaluate(() => {
      const getText = (selector: string) =>
        document.querySelector(selector)?.textContent?.trim() || "";

      const avatar = document
        .querySelector(
          'img[class^="InstagramViewerProfile-module__avatarImage"]'
        )
        ?.getAttribute("src");

      const username = getText(
        'div[class^="InstagramViewerProfile-module__profileInfoName"]'
      );

      const bio = getText(
        'div[class^="InstagramViewerProfile-module__profileInfoBio"]'
      );

      const stats = document.querySelectorAll(
        'div[class^="InstagramViewerProfile-module__statsItemValue"]'
      );

      const posts = stats[0]?.textContent?.trim();
      const follower = stats[1]?.textContent?.trim();

      const list = Array.from(
        document.querySelectorAll(
          'div[class*="InstagramViewerPost-module__post"]'
        )
      ).map((post) => {
        const image = post
          .querySelector('img[class*="InstagramViewerPost-module__image"]')
          ?.getAttribute("src");

        return {
          image,
        };
      });

      return {
        avatar,
        username,
        bio,
        posts_count: posts,
        follower_count: follower,
        posts: list,
      };
    });

    await browser.close();

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch {
    if (browser) await browser.close();

    return NextResponse.json({
      success: false,
      message: "Something wrong",
    });
  }
}
