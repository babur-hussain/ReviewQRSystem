# Simple Setup - No Google Apps Script Required

## Option 1: Use Google Forms (Recommended)

### Step 1: Create a Google Form
1. Go to [Google Forms](https://forms.google.com/)
2. Create a new form titled "Kapoor & Sons - Free Glass Guard Claim"
3. Add these fields:
   - **Name** (Short answer, Required)
   - **Mobile Number** (Short answer, Required)
   - **Timestamp** (Short answer, Optional - will be auto-filled)

### Step 2: Link to Google Sheet
1. In your Google Form, click the "Responses" tab
2. Click the Google Sheets icon to create a new spreadsheet
3. This will automatically create a new sheet linked to your form

### Step 3: Update the React App
Replace the form submission with a redirect to your Google Form:

```javascript
const handleClaimSubmit = (e) => {
  e.preventDefault();
  if (!claimForm.name.trim() || !claimForm.mobile.trim()) return;
  
  // Open Google Form in new tab with pre-filled data
  const formUrl = 'YOUR_GOOGLE_FORM_URL_HERE';
  const prefilledUrl = `${formUrl}?entry.NAME_FIELD_ID=${encodeURIComponent(claimForm.name)}&entry.MOBILE_FIELD_ID=${encodeURIComponent(claimForm.mobile)}`;
  
  window.open(prefilledUrl, '_blank');
  
  // Mark as claimed
  setOfferStatus({ claimed: true, claimTime: Date.now() });
  setShowOfferPopup(false);
  setClaimForm({ name: '', mobile: '' });
};
```

## Option 2: Use Formspree (Even Simpler)

### Step 1: Create Formspree Account
1. Go to [Formspree](https://formspree.io/)
2. Sign up for free
3. Create a new form
4. Get your form endpoint URL

### Step 2: Update React App
```javascript
const handleClaimSubmit = async (e) => {
  e.preventDefault();
  if (!claimForm.name.trim() || !claimForm.mobile.trim()) return;

  setIsSubmitting(true);
  
  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: claimForm.name,
        mobile: claimForm.mobile,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      setOfferStatus({ claimed: true, claimTime: Date.now() });
      setShowOfferPopup(false);
      setClaimForm({ name: '', mobile: '' });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

## Option 3: Manual Data Collection (Current Implementation)

The current implementation logs the data to the browser console. You can:

1. **Check browser console** for form submissions
2. **Manually add data** to your Google Sheet
3. **Use the data** for follow-up with customers

## Current Status

✅ **Form works immediately** - no setup required
✅ **User experience is smooth** - shows success message
✅ **Data is logged** - check browser console for submissions
⚠️ **Manual data entry** - you'll need to add data to Google Sheet manually

## Recommendation

Use **Option 1 (Google Forms)** as it's the simplest and most reliable method that integrates directly with Google Sheets without any coding.
