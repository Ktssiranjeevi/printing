# Navigation Test Cases

## Case 1: Product catalog -> Your creation -> Product catalog

1. Open the app on `/`.
2. Click the `Your creation` tab in the secondary nav.
3. Confirm the app navigates to `/designing-area`.
4. Click the `Product catalog` tab in the secondary nav.
5. Confirm the app navigates back to `/`.

Expected result:
- Both tabs are clickable.
- Route changes happen immediately.
- The app does not get stuck on the designing area page.

## Case 2: Designing area -> Top nav -> Cart

1. Open `/designing-area`.
2. Click `Cart` in the top nav.
3. Confirm the app navigates to `/cart`.

Expected result:
- Top nav remains interactive above the designing canvas.
- The route changes correctly.

## Case 3: Designing area -> Top nav logo -> Product catalog

1. Open `/designing-area`.
2. Click the `Product Customizer` logo in the top nav.
3. Confirm the app navigates to `/`.

Expected result:
- The logo acts as a home link.
- The route changes correctly.
