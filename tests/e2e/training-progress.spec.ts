import { test, expect } from './helpers/auth';
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

let testUserId: string;

test.beforeAll(async () => {
  // Resolve the test user's ID from Supabase auth
  const client = await createTestClient();
  const { data } = await client.auth.getUser();
  testUserId = data.user!.id;

  // Clean any leftover data from previous runs
  await cleanupTestData(testUserId);
});

test.afterAll(async () => {
  // Clean up all test data
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

    // Verify lesson content renders — look for the lesson heading
    const heading = authedPage.locator('h2, h3').first();
    await expect(heading).toBeVisible({ timeout: 10_000 });

    // Verify breadcrumb contains the course
    const breadcrumb = authedPage.locator('nav[aria-label="breadcrumb"], ol').first();
    await expect(breadcrumb).toBeVisible();
  });

  test('complete lesson and UI updates', async ({ authedPage }) => {
    await authedPage.goto(LESSON_URL);
    await authedPage.waitForLoadState('networkidle');

    // Wait for lesson content to load
    await authedPage.waitForTimeout(2_000);

    // Click the complete button (green button with "Concluir" or "Complete")
    const completeButton = authedPage.locator('button[class*="green"], button').filter({
      hasText: /concluir|complete/i,
    }).first();
    await expect(completeButton).toBeVisible({ timeout: 10_000 });
    await completeButton.click();

    // Wait for Supabase sync
    await authedPage.waitForTimeout(3_000);

    // Navigate back to the completed lesson to check the green checkmark
    await authedPage.goto(LESSON_URL);
    await authedPage.waitForLoadState('networkidle');
    await authedPage.waitForTimeout(2_000);

    // Verify the completed indicator is visible (text "Concluído" or "Completed" with green color)
    const completedIndicator = authedPage.locator('text=/conclu[ií]d[oa]|completed/i').first();
    await expect(completedIndicator).toBeVisible({ timeout: 10_000 });
  });

  test('progress persists on reload', async ({ authedPage }) => {
    // Go directly to the lesson
    await authedPage.goto(LESSON_URL);
    await authedPage.waitForLoadState('networkidle');
    await authedPage.waitForTimeout(3_000);

    // Verify the completed indicator persists after reload
    const completedIndicator = authedPage.locator('text=/conclu[ií]d[oa]|completed/i').first();
    await expect(completedIndicator).toBeVisible({ timeout: 10_000 });

    // Hard reload (clear bfcache)
    await authedPage.reload();
    await authedPage.waitForLoadState('networkidle');
    await authedPage.waitForTimeout(3_000);

    // Still shows as completed
    const completedAfterReload = authedPage.locator('text=/conclu[ií]d[oa]|completed/i').first();
    await expect(completedAfterReload).toBeVisible({ timeout: 10_000 });
  });

  test('Supabase has progress row', async () => {
    const rows = await getProgressRows(testUserId);

    const match = rows.find(
      (r: Record<string, unknown>) =>
        r.course_slug === COURSE &&
        r.module_slug === MODULE &&
        r.lesson_slug === LESSON,
    );

    expect(match).toBeDefined();
    expect(match.completed_at).toBeTruthy();
  });

  test('session tracked in Supabase', async () => {
    const rows = await getSessionRows(testUserId);

    const match = rows.find(
      (r: Record<string, unknown>) =>
        r.course_slug === COURSE &&
        r.module_slug === MODULE &&
        r.lesson_slug === LESSON,
    );

    expect(match).toBeDefined();
    // Session should have tracked some active time
    expect(match.active_seconds).toBeGreaterThanOrEqual(0);
  });

  test('events logged in Supabase', async () => {
    const rows = await getEventRows(testUserId);

    const eventTypes = rows.map((r: Record<string, unknown>) => r.event_type);

    // lesson_open fires when entering the lesson page
    expect(eventTypes).toContain('lesson_open');
    // lesson_complete fires when clicking complete
    expect(eventTypes).toContain('lesson_complete');
  });
});
