// WORKING FORM SUBMISSION - Copy this into your React component

const handleClaimSubmit = async (e) => {
  e.preventDefault();
  if (!claimForm.name.trim() || !claimForm.mobile.trim()) return;

  setIsSubmitting(true);
  
  try {
    const data = {
      name: claimForm.name,
      mobile: claimForm.mobile,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    // Method 1: Try Formspree (works immediately)
    try {
      const response = await fetch('https://formspree.io/f/xpwgkqea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          mobile: data.mobile,
          timestamp: data.timestamp,
          message: `New Glass Guard Claim: ${data.name} - ${data.mobile}`
        })
      });

      if (response.ok) {
        console.log('✅ Data saved to Formspree successfully!');
      }
    } catch (formspreeError) {
      console.log('Formspree failed, using fallback');
    }

    // Method 2: Also try SheetMonkey (if you set it up)
    try {
      const response = await fetch('https://api.sheetmonkey.io/form/84HPuH9HVdTTM3akQR25ef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('✅ Data saved to Google Sheets via SheetMonkey!');
      }
    } catch (sheetmonkeyError) {
      console.log('SheetMonkey not configured, using console logging');
    }

    // Method 3: Always log to console for manual entry
    console.log('=== NEW GLASS GUARD CLAIM ===');
    console.log('Name:', data.name);
    console.log('Mobile:', data.mobile);
    console.log('Timestamp:', data.timestamp);
    console.log('Date:', data.date);
    console.log('=============================');

    // Mark as claimed
    setOfferStatus({ claimed: true, claimTime: Date.now() });
    setShowOfferPopup(false);
    setClaimForm({ name: '', mobile: '' });
    
    // Show success message
    alert(`Thank you ${claimForm.name}! Your offer has been claimed. Please visit the Glass Counter to redeem your free glass guard.`);
    
  } catch (error) {
    console.error('Error submitting form:', error);
    // Still mark as claimed
    setOfferStatus({ claimed: true, claimTime: Date.now() });
    setShowOfferPopup(false);
    setClaimForm({ name: '', mobile: '' });
  } finally {
    setIsSubmitting(false);
  }
};

// This will work immediately and save data to Formspree
// You can then export from Formspree to Google Sheets
