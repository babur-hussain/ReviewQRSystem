// Formspree Integration - Simple Alternative to Google Sheets
// This is an example of how to integrate Formspree for automatic data collection

const handleClaimSubmitWithFormspree = async (e) => {
  e.preventDefault();
  if (!claimForm.name.trim() || !claimForm.mobile.trim()) return;

  setIsSubmitting(true);
  
  try {
    const data = {
      name: claimForm.name,
      mobile: claimForm.mobile,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      source: 'Kapoor Sons Website'
    };

    // Replace 'YOUR_FORMSPREE_ID' with your actual Formspree form ID
    const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log('Data submitted to Formspree successfully');
      // Mark as claimed
      setOfferStatus({ claimed: true, claimTime: Date.now() });
      setShowOfferPopup(false);
      setClaimForm({ name: '', mobile: '' });
      
      alert(`Thank you ${claimForm.name}! Your offer has been claimed. Please visit the Glass Counter to redeem your free glass guard.`);
    } else {
      throw new Error('Form submission failed');
    }
    
  } catch (error) {
    console.error('Error submitting form:', error);
    // Still mark as claimed for user experience
    setOfferStatus({ claimed: true, claimTime: Date.now() });
    setShowOfferPopup(false);
    setClaimForm({ name: '', mobile: '' });
    
    alert(`Thank you ${claimForm.name}! Your offer has been claimed. Please visit the Glass Counter to redeem your free glass guard.`);
  } finally {
    setIsSubmitting(false);
  }
};

// To use this:
// 1. Go to https://formspree.io/
// 2. Sign up for free
// 3. Create a new form
// 4. Copy your form ID
// 5. Replace 'YOUR_FORMSPREE_ID' with your actual ID
// 6. Replace the handleClaimSubmit function in KapoorSonsLanding.tsx with this one
