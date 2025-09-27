# Google Form Setup - Automatic Google Sheets Integration

## Step 1: Create Google Form

1. Go to [Google Forms](https://forms.google.com/)
2. Click "Blank" to create a new form
3. Title: "Kapoor & Sons - Free Glass Guard Claim"

## Step 2: Add Form Fields

Add these questions in order:

1. **Name** (Short answer, Required)
2. **Mobile Number** (Short answer, Required)  
3. **Timestamp** (Short answer, Optional)

## Step 3: Link to Your Google Sheet

1. Click the "Responses" tab in your form
2. Click the Google Sheets icon (green spreadsheet icon)
3. Choose "Create a new spreadsheet"
4. Name it "Free Glass Guard Data" (or use your existing sheet)
5. Click "Create"

## Step 4: Get Form IDs

1. In your Google Form, click "Send" button
2. Click the link icon to get the form URL
3. Copy the URL - it looks like: `https://docs.google.com/forms/d/e/1FAIpQLSfYOUR_FORM_ID/viewform`
4. Extract the `YOUR_FORM_ID` part

## Step 5: Get Field Entry IDs

1. Right-click on your form and "View Page Source"
2. Search for "entry." to find field IDs
3. Look for patterns like:
   - `entry.1234567890` (Name field)
   - `entry.0987654321` (Mobile field)
   - `entry.1122334455` (Timestamp field)

## Step 6: Update React Code

Replace these placeholders in `src/components/KapoorSonsLanding.tsx`:

```javascript
// Line 230: Replace YOUR_FORM_ID
const response = await fetch('https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse', {

// Line 237-239: Replace field IDs
body: new URLSearchParams({
  'entry.YOUR_NAME_FIELD_ID': data.name,
  'entry.YOUR_MOBILE_FIELD_ID': data.mobile,
  'entry.YOUR_TIMESTAMP_FIELD_ID': data.timestamp
})

// Line 247: Replace YOUR_FORM_ID and field IDs
const googleFormUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url&entry.YOUR_NAME_FIELD_ID=${encodeURIComponent(data.name)}&entry.YOUR_MOBILE_FIELD_ID=${encodeURIComponent(data.mobile)}`;
```

## Step 7: Test

1. Complete both Instagram follow and Google review
2. Click "Claim Offer"
3. Fill out the form and submit
4. Check your Google Sheet for new entries

## Alternative: Use Formspree (Even Easier)

If Google Forms is too complex, use Formspree:

1. Go to [Formspree](https://formspree.io/)
2. Sign up for free
3. Create a new form
4. Get your form endpoint
5. Replace the fetch URL with your Formspree endpoint

## Current Status

✅ **Form works** - users can claim offers
✅ **Data collection** - through Google Form or Formspree
✅ **Google Sheets integration** - automatic when using Google Form
✅ **No coding required** - just form setup
