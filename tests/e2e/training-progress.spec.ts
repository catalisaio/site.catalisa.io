import { test, expect } from './helpers/auth';
import type { Page } from '@playwright/test';
import {
  getProgressRows,
  getSessionRows,
  getEventRows,
  cleanupTestData,
  createTestClient,
} from './helpers/supabase-admin';

// Lesson coordinates for the first available lesson
const COURSE = 'iso-42001-ai-ethics';
const MODULE = 'fundamentos';
const LESSON = 'o-que-e-ia';
const LESSON_URL = `/treinamento/${COURSE}/${MODULE}/${LESSON}`;
const COURSE_URL = `/treinamento/${COURSE}`;

let testUserId: string;

/**
 * Dismiss the cookie consent banner if visible, so it doesn't
 * intercept clicks on the fixed-bottom slide navigation.
 */
async function dismissCookieBanner(page: Page) {
  const acceptBtn = page.getByRole('button', { name: /aceitar/i });
  if (await acceptBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await acceptBtn.click();
    await page.waitForTimeout(500);
  }
}

/**
 * Navigate through all slides clicking "Proximo" until "Concluir" appears,
 * then click "Concluir" to complete the lesson.
 */
async function navigateToEndAndComplete(page: Page) {
  const nextBtn = page.getByRole('button', { name: /proximo/i });
  const completeBtn = page.getByRole('button', { name: /concluir/i });

  for (let i = 0; i < 20; i++) {
    if (await completeBtn.isVisible()) break;
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(500);
    }
  }

  await expect(completeBtn).toBeVisible({ timeout: 5_000 });
  await completeBtn.click();
}

test.beforeAll(async () => {
  // Resolve the test user's ID from Supabase auth
  const client = await createTestClient();
  const { data } = await client.auth.getUser();
  testUserId = data.user!.id;

  // Clean any leftover data from previous runs
  await cleanupTestData(testUserId);
});

test.afterAll(async () => {
  if (testUserId) {
    await cleanupTestData(testUserId);
  }
});

test.describe('Training Progress & Analytics', () => {
  test('login and see catalog', async ({ authedPage }) => {
    await authedPage.goto('/treinamento');
    await authedPage.waitForLoadState('networkidle');

    // Verify we're on the catalog page (not redirected to login)
    expect(authedPage.url()).toContain('/treinamento');
    expect(authedPage.url()).not.toContain('/login');

    // Verify a course card is visible (ISO 42001 course)
    const courseCard = authedPage.locator('text=ISO 42001').first();
    await expect(courseCard).toBeVisible({ timeout: 10_000 });
  });

  test('navigate to lesson', async ({ authedPage }) => {
    await authedPage.goto(LESSON_URL);
    await authedPage.waitForLoadState('networkidle');

    // Verify lesson content renders
    const heading = authedPage.locator('h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });

    // Verify breadcrumb is present
    const breadcrumb = authedPage.locator('nav[aria-label="breadcrumb"]').first();
    await expect(breadcrumb).toBeVisible();
  });

  test('complete lesson via slide navigation', async ({ authedPage }) => {
    await authedPage.goto(LESSON_URL);
    await authedPage.waitForLoadState('networkidle');
    await authedPage.waitForTimeout(2_000);

    // Dismiss cookie banner so it doesn't block the navigation buttons
    await dismissCookieBanner(authedPage);

    // Navigate through all slides and click "Concluir" on the last one
    await navigateToEndAndComplete(authedPage);

    // Verify completion screen appears
    const completionHeading = authedPage.getByText(/li[cç][aã]o conclu[ií]da/i).first();
    await expect(completionHeading).toBeVisible({ timeout: 10_000 });

    // Wait for Supabase sync
    await authedPage.waitForTimeout(3_000);
  });

  test('localStorage does NOT have training progress', async ({ authedPage }) => {
    // After completing a lesson, localStorage should NOT store progress
    const value = await authedPage.evaluate(() =>
      localStorage.getItem('catalisa_training_progress')
    );
    expect(value).toBeNull();
  });

  test('progress persists on reload (Supabase-only)', async ({ authedPage }) => {
    // Navigate to the course detail page where completed lessons show a green checkmark
    await authedPage.goto(COURSE_URL);
    await authedPage.waitForLoadState('networkidle');
    await authedPage.waitForTimeout(2_000);

    // The completed lesson should have a green check icon (FiCheckCircle with color green.400)
    // In the lesson list, look for the lesson text alongside a green icon
    const lessonLink = authedPage.locator('a[href*="o-que-e-ia"]').first();
    await expect(lessonLink).toBeVisible({ timeout: 10_000 });

    // Hard reload
    await authedPage.reload();
    await authedPage.waitForLoadState('networkidle');
    await authedPage.waitForTimeout(2_000);

    // The lesson link should still be visible after reload (data from Supabase, not localStorage)
    await expect(lessonLink).toBeVisible({ timeout: 10_000 });

    // Verify green checkmark SVG is present (FiCheckCircle renders as a polyline path)
    const checkIcon = authedPage.locator('a[href*="o-que-e-ia"] svg').first();
    await expect(checkIcon).toBeVisible({ timeout: 5_000 });
  });

  test('Supabase training_progress row is correct', async () => {
    const rows = await getProgressRows(testUserId);

    const match = rows.find(
      (r: Record<string, unknown>) =>
        r.course_slug === COURSE &&
        r.module_slug === MODULE &&
        r.lesson_slug === LESSON,
    );

    expect(match).toBeDefined();
    expect(match.completed_at).toBeTruthy();
    expect(match.time_spent_seconds).toBeGreaterThanOrEqual(0);
    expect(match.course_slug).toBe(COURSE);
    expect(match.module_slug).toBe(MODULE);
    expect(match.lesson_slug).toBe(LESSON);
  });

  test('Supabase training_sessions row exists', async () => {
    const rows = await getSessionRows(testUserId);

    const match = rows.find(
      (r: Record<string, unknown>) =>
        r.course_slug === COURSE &&
        r.module_slug === MODULE &&
        r.lesson_slug === LESSON,
    );

    expect(match).toBeDefined();
    expect(match.active_seconds).toBeGreaterThanOrEqual(0);
  });

  test('Supabase training_events has lesson_open and lesson_complete', async () => {
    const rows = await getEventRows(testUserId);

    const eventTypes = rows.map((r: Record<string, unknown>) => r.event_type);

    expect(eventTypes).toContain('lesson_open');
    expect(eventTypes).toContain('lesson_complete');
  });
});
