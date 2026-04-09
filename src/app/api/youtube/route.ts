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
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--single-process",
        "--no-zygote",
      ],
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

    await page.goto(`https://www.youtube.com/@${_username}/videos`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    /* 1️⃣ Tunggu profile header */
    await page.waitForSelector(".ytPageHeaderViewModelContent");

    const profile = await page.evaluate(() => {
      function parseIndoNumber(
        value: string | null | undefined
      ): number | null {
        if (!value) return 0;

        // normalize whitespace (handle NBSP)
        const normalized = value
          .toLowerCase()
          .replace(/\u00a0/g, " ") // NBSP -> space
          .trim();

        // ambil angka (handle koma desimal Indonesia)
        const match = normalized.match(/[\d,.]+/);
        if (!match) return 0;

        const num = parseFloat(
          match[0]
            .replace(/\./g, "") // hapus pemisah ribuan
            .replace(",", ".") // koma -> titik desimal
        );

        if (normalized.includes("jt")) return Math.round(num * 1_000_000);
        if (normalized.includes("rb")) return Math.round(num * 1_000);
        if (normalized.includes("m")) return Math.round(num * 1_000_000);
        if (normalized.includes("k")) return Math.round(num * 1_000);
        if (normalized.includes("b")) return Math.round(num * 1_000_000_000);

        return Math.round(num);
      }

      const avatar = document
        .querySelector(".yt-spec-avatar-shape--avatar-size-giant img")
        ?.getAttribute("src");

      const username = document
        .querySelector(".yt-dynamic-text-view-model h1")
        ?.childNodes[0]?.textContent?.trim();

      const items = document.querySelectorAll(
        "yt-content-metadata-view-model span.yt-core-attributed-string"
      );

      let follower_count = "0";
      let posts_count = "0";

      items.forEach((el) => {
        const text = el.textContent?.toLowerCase() || "";

        if (text.includes("subscriber")) {
          const subscriber = text.replace("subscriber", "").trim();
          follower_count = String(parseIndoNumber(subscriber));
        }

        if (text.includes("video")) {
          const video = text.replace("video", "").trim();
          posts_count = String(parseIndoNumber(video));
        }
      });

      return {
        avatar,
        username,
        follower_count,
        posts_count,
      };
    });

    /* 2️⃣ Tunggu list post muncul */
    await page.waitForSelector("#content");

    const posts = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".ytd-thumbnail"));

      return items
        .map((item) => {
          const img = item.querySelector("img");

          return {
            image: img?.getAttribute("src") || null,
          };
        })
        .filter((item) => item.image)
        .slice(1, 7);
    });

    await browser.close();

    return NextResponse.json({
      success: true,
      message: "success",
      data: { ...profile, posts },
    });
  } catch (error) {
    console.log(error);
    if (browser) await browser.close();

    return NextResponse.json({
      success: false,
      message: "Something wrong",
    });
  }
}
