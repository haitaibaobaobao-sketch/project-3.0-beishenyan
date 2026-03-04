const { chromium } = require('playwright');
const path = require('path');

// 使用正斜杠的路径
const SOFTWARE_PATH = 'C:/Users/MateBook D16/Desktop/文献标识查询项目/temp_source/文献标识查询平台V1.0';
const SCREENSHOT_DIR = 'C:/Users/MateBook D16/Desktop/screenshots';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('开始截取界面...');

  try {
    // 1. 主页概览
    console.log('1/15 截取主页概览...');
    await page.goto(`file:///${SOFTWARE_PATH}/index.html`);
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-主页概览.png`,
      fullPage: false
    });

    // 2. 关键词搜索模式
    console.log('2/15 截取关键词搜索模式...');
    const keywordTab = page.locator('button[data-mode="keyword"]');
    if (await keywordTab.count() > 0) {
      await keywordTab.click();
      await page.waitForTimeout(500);
    }
    await page.fill('#searchInput', 'machine learning');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-关键词搜索模式.png`,
      fullPage: false
    });

    // 3. DOI查询模式
    console.log('3/15 截取DOI查询模式...');
    const doiTab = page.locator('button[data-mode="doi"]');
    if (await doiTab.count() > 0) {
      await doiTab.click();
      await page.waitForTimeout(500);
    }
    await page.fill('#searchInput', '10.1038/nature14539');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-DOI查询模式.png`,
      fullPage: false
    });

    // 4. 功能介绍区域
    console.log('4/15 截取功能介绍区域...');
    await page.goto(`file:///${SOFTWARE_PATH}/index.html`);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/04-功能介绍.png`,
      fullPage: true
    });

    // 5-15. 其他界面截图
    for (let i = 5; i <= 15; i++) {
      console.log(`${i}/15 截取界面 ${i}...`);
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/${String(i).padStart(2, '0')}-界面${i}.png`,
        fullPage: i % 2 === 0
      });
    }

    console.log('\n✅ 所有截图完成！');
    console.log(`截图保存位置: ${SCREENSHOT_DIR}`);

  } catch (error) {
    console.error('❌ 截图过程出错:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
