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

    await page.goto(`https://www.tikvib.com/profile/${_username}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    /* 1️⃣ Tunggu profile header */
    await page.waitForSelector(".profile-info");

    const profile = await page.evaluate(() => {
      const avatar = document
        .querySelector('img[class^="profile-image"]')
        ?.getAttribute("src");

      const username = document
        .querySelector("div.profile-info h5.username")
        ?.textContent?.replace("@", "")
        ?.trim();

      const stats = Array.from(document.querySelectorAll(".profile-stat-item"));

      let totalPosts = "0";
      let totalFollowers = "0";

      stats.forEach((item) => {
        const label = item
          .querySelector(".profile-stat-label")
          ?.textContent?.trim()
          ?.toLowerCase();

        const number = item
          .querySelector(".profile-stat-number")
          ?.textContent?.trim();

        if (label === "posts") {
          totalPosts = number ?? '0';
        }

        if (label === "followers") {
          totalFollowers = number ?? '0';
        }
      });

      return {
        avatar,
        username,
        posts_count: totalPosts,
        follower_count: totalFollowers,
      };
    });

    const hasNoPosts = await page.evaluate(() => {
      const empty = document.querySelector(".posts-empty");

      return empty?.textContent?.toLowerCase().includes("no posts") || false;
    });

    if (hasNoPosts) {
      return NextResponse.json({
        success: true,
        message: "success",
        data: { ...profile, posts: [], private: false },
      });
    }

    /* 2️⃣ Tunggu list post muncul */
    await page.waitForSelector('div[class*="posts__video-item"]');

    const posts = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".posts__video-item"));

      return items.slice(0, 6).map((item) => {
        const img = item.querySelector("img");

        const info = item.querySelector(".posts__video-item-story-info");

        const download = item.querySelector(
          ".posts__video-item-story-download"
        );

        return {
          image: img?.getAttribute("src") || null,
          caption: img?.getAttribute("alt") || null,

          likes: info?.getAttribute("data-likes") || "0",
          views: info?.getAttribute("data-views") || "0",
          comments: info?.getAttribute("data-comments") || "0",
          shares: info?.getAttribute("data-shares") || "0",
          time: info?.getAttribute("data-time") || null,

          video_download: download?.getAttribute("data-source") || null,
          music_download: download?.getAttribute("data-music") || null,
        };
      });
    });

    await browser.close();

    return NextResponse.json({
      success: true,
      message: "success",
      data: { ...profile, posts, private: false },
    });
  } catch {
    if (browser) await browser.close();

    return NextResponse.json({
      success: false,
      message: "Something wrong",
    });
  }
}
