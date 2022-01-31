import * as puppeteer from 'puppeteer';
import { ROOT_PATH, IS_HEADLESS } from './globals';

let browser: puppeteer.Browser;
let isSpecialBrowser = false;

async function launchBrowser(args?: object) {
  let configuration: puppeteer.LaunchOptions = {
    userDataDir: ROOT_PATH + 'data',
    headless: IS_HEADLESS
  };

  if (args) {
    configuration = {
      ...configuration,
      ...args
    };
  }

  browser = await puppeteer.launch(configuration);
}

export async function getBrowser(): Promise<puppeteer.Browser> {
  if (!browser) {
    await launchBrowser();
  }

  return browser;
}

export async function getSpecialBrowser(): Promise<puppeteer.Browser> {
  const specialArgs = {
    defaultViewport: null,
    args: ['--window-size=1920,0']
  };

  if (isSpecialBrowser) {
    return browser;
  }

  // If a browser is open but not special then close it
  if (browser) {
    await browser.close();
    browser = undefined;
  }

  if (!browser) {
    await launchBrowser(specialArgs);
  }

  isSpecialBrowser = true;
  return browser;
}

export async function getPage(): Promise<puppeteer.Page> {
  if (!browser) {
    throw new Error('No browser initialted yet');
  }

  let [page] = await browser.pages();
  if (!page) {
    page = await browser.newPage();
  }

  return page;
}

export async function closeBrowser(): Promise<void> {
  if (!browser) {
    throw new Error('No browser initialted yet');
  }

  await browser.close();
}
