import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { AdminUrlUtil } from '../../helpers/adminUrlUtil';
import { initPayloadTest } from '../../helpers/configHelpers';
import { login } from '../helpers';
import { textDoc } from './shared';

const { beforeAll, describe } = test;

let page: Page;
let url: AdminUrlUtil;

describe('fields', () => {
  beforeAll(async ({ browser }) => {
    const { serverURL } = await initPayloadTest({
      __dirname,
      init: {
        local: false,
      },
    });

    url = new AdminUrlUtil(serverURL, 'text-fields');

    const context = await browser.newContext();
    page = await context.newPage();

    await login({ page, serverURL });
  });

  describe('text', () => {
    test('should display field in list view', async () => {
      await page.goto(url.list);
      const textCell = await page.locator('table tr:first-child td:first-child a');
      await expect(textCell).toHaveText(textDoc.text);
    });
  });
});