// Google Apps Script for Kapoor & Sons Offer Claims
// Deploy this as a web app with execute permissions for "Anyone"

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the specific spreadsheet by ID
    const spreadsheet = SpreadsheetApp.openById('1YUN5tvozwAg3iTQK_G4GDI0ZInpDuWIWNcAHcZ7bXVI');
    const sheet = spreadsheet.getActiveSheet();
    
    // If this is the first time, add headers
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Name', 'Mobile', 'Timestamp', 'Date']]);
    }
    
    // Add the new data
    const timestamp = new Date(data.timestamp);
    const date = timestamp.toLocaleDateString();
    const time = timestamp.toLocaleTimeString();
    
    sheet.appendRow([
      data.name,
      data.mobile,
      `${date} ${time}`,
      date
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Kapoor & Sons Offer Claims API',
      status: 'active'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
