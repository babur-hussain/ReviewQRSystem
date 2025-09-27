# Google Sheets Integration Setup

## Step 1: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project with a name like "Kapoor Sons Offer Claims"

## Step 2: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Kapoor Sons Offer Claims"
4. Note the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 3: Link Script to Sheet

1. In your Google Apps Script project, click on "Resources" > "Libraries"
2. Add the Google Sheets API library (ID: `1B7FSrk5Zi6L1rSxxTDgDEUsPklukxJBLBn2bU3X6Tix9y4UBHK5MaK-Hz`)
3. In the script, replace `SpreadsheetApp.getActiveSheet()` with:
   ```javascript
   const spreadsheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID_HERE');
   const sheet = spreadsheet.getActiveSheet();
   ```

## Step 4: Deploy as Web App

1. In your Google Apps Script project, click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the web app URL

## Step 5: Update React App

1. Open `src/components/KapoorSonsLanding.tsx`
2. Find the line: `const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';`
3. Replace `YOUR_SCRIPT_ID_HERE` with your actual web app URL

## Step 6: Test

1. Complete both Instagram follow and Google review tasks
2. Click "Claim Offer" and fill out the form
3. Check your Google Sheet to see if the data appears

## Troubleshooting

- Make sure the Google Apps Script has permission to access your Google Sheet
- Check the browser console for any error messages
- Verify the web app URL is correct and accessible
- Ensure the spreadsheet ID is correct in the script

## Data Structure

The Google Sheet will have these columns:
- Name
- Mobile
- Timestamp
- Date
