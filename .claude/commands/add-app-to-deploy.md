Add the app named `$ARGUMENTS` to the GitHub Actions deploy workflow.

Follow these steps exactly:

1. Read `.github/workflows/deploy.yml` to see the current state.

2. In the `build` job steps, add two new steps for `$ARGUMENTS` immediately before the "Arrange site structure" step:
   ```yaml
   - run: npm ci
     working-directory: $ARGUMENTS
   - run: npm run build
     working-directory: $ARGUMENTS
   ```

3. In the "Arrange site structure" run block, add two new lines for `$ARGUMENTS`:
   ```
   mkdir -p _site/$ARGUMENTS
   cp -r $ARGUMENTS/dist/. _site/$ARGUMENTS/
   ```

4. Save the file, then commit and push to master with the message:
   "Extend deploy workflow to include $ARGUMENTS app"
