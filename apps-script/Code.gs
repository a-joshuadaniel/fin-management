/**
 * Finance Manager - Google Apps Script Backend
 *
 * This script acts as a REST-like API between the
 * GitHub Pages frontend and Google Sheets data store.
 *
 * Deploy as: Web App
 * Execute as: Me
 * Access: Anyone
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    let result;
    switch (action) {
      case "getCreditCards":
        result = getCreditCards();
        break;
      case "createCreditCard":
        result = createCreditCard(payload.card);
        break;
      case "updateCreditCard":
        result = updateCreditCard(payload.id, payload.card);
        break;
      case "deleteCreditCard":
        result = deleteCreditCard(payload.id);
        break;
      case "ping":
        result = { status: "ok", timestamp: new Date().toISOString() };
        break;
      default:
        return jsonResponse({ error: "Unknown action: " + action }, 400);
    }

    return jsonResponse({ data: result });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

function doGet(e) {
  // Support GET requests with payload parameter (CORS fallback)
  if (e && e.parameter && e.parameter.payload) {
    try {
      var fakeEvent = {
        postData: { contents: e.parameter.payload }
      };
      return doPost(fakeEvent);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }

  return jsonResponse({
    data: { status: "ok", message: "Finance Manager API" },
  });
}

function jsonResponse(data, status) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Ensures the CreditCards sheet exists with headers.
 */
function ensureCreditCardsSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("CreditCards");

  if (!sheet) {
    sheet = ss.insertSheet("CreditCards");
    const headers = [
      "id",
      "nickname",
      "bankName",
      "lastFourDigits",
      "network",
      "billingCycleStartDay",
      "billingCycleEndDay",
      "paymentDueDay",
      "creditLimit",
      "currentBalance",
      "color",
      "status",
      "createdAt",
      "updatedAt",
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getCreditCards() {
  const sheet = ensureCreditCardsSheet();
  const data = sheet.getDataRange().getValues();

  if (data.length <= 1) return [];

  const headers = data[0];
  const cards = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const card = {};
    headers.forEach(function (header, j) {
      card[header] = row[j];
    });
    // Convert numeric fields
    card.billingCycleStartDay = Number(card.billingCycleStartDay);
    card.billingCycleEndDay = Number(card.billingCycleEndDay);
    card.paymentDueDay = Number(card.paymentDueDay);
    card.creditLimit = String(card.creditLimit);
    card.currentBalance = String(card.currentBalance);
    cards.push(card);
  }

  return cards;
}

function createCreditCard(cardData) {
  const sheet = ensureCreditCardsSheet();
  const now = new Date().toISOString();
  const id = Utilities.getUuid();

  const row = [
    id,
    cardData.nickname,
    cardData.bankName,
    cardData.lastFourDigits,
    cardData.network,
    cardData.billingCycleStartDay,
    cardData.billingCycleEndDay,
    cardData.paymentDueDay,
    cardData.creditLimit,
    cardData.currentBalance,
    cardData.color,
    cardData.status || "active",
    now,
    now,
  ];

  sheet.appendRow(row);

  return {
    id: id,
    ...cardData,
    status: cardData.status || "active",
    createdAt: now,
    updatedAt: now,
  };
}

function updateCreditCard(id, updates) {
  const sheet = ensureCreditCardsSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("id");

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      const now = new Date().toISOString();

      Object.keys(updates).forEach(function (key) {
        const col = headers.indexOf(key);
        if (col !== -1 && key !== "id" && key !== "createdAt") {
          sheet.getRange(i + 1, col + 1).setValue(updates[key]);
        }
      });

      // Update updatedAt
      const updatedAtCol = headers.indexOf("updatedAt");
      sheet.getRange(i + 1, updatedAtCol + 1).setValue(now);

      // Return updated card
      const updatedRow = sheet.getRange(i + 1, 1, 1, headers.length).getValues()[0];
      const card = {};
      headers.forEach(function (header, j) {
        card[header] = updatedRow[j];
      });
      card.billingCycleStartDay = Number(card.billingCycleStartDay);
      card.billingCycleEndDay = Number(card.billingCycleEndDay);
      card.paymentDueDay = Number(card.paymentDueDay);
      return card;
    }
  }

  throw new Error("Card not found: " + id);
}

function deleteCreditCard(id) {
  const sheet = ensureCreditCardsSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("id");

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      return { deleted: true };
    }
  }

  throw new Error("Card not found: " + id);
}
