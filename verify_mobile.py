import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 375, 'height': 667})
        page = await context.new_page()

        print("Navigating to app...")
        try:
            await page.goto("http://localhost:5173", timeout=10000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            await browser.close()
            return

        await page.wait_for_selector('h1')

        # Use specific unique classes based on the grid columns
        controls = page.locator('.lg\\:col-span-4').first
        preview = page.locator('.lg\\:col-span-8').first

        controls_box = await controls.bounding_box()
        preview_box = await preview.bounding_box()

        if controls_box and preview_box:
            print(f"Preview Y: {preview_box['y']}")
            print(f"Controls Y: {controls_box['y']}")

            # We expect Preview (order-1) to be ABOVE Controls (order-2) on mobile
            if preview_box['y'] < controls_box['y']:
                print("Layout verified: Preview is ABOVE Controls on mobile.")
            else:
                print(f"WARNING: Layout unexpected. Preview Y ({preview_box['y']}) >= Controls Y ({controls_box['y']})")
        else:
            print("Could not find elements.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
