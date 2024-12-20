const quizData = {
  french: [],
  american: [],
  battles: [],
  figures: [],
};
const sheetIds = {
  french: "0",
  american: "570370938",
  battles: "223253803",
  figures: "1228833307",
};

const spreadsheetId =
  "2PACX-1vS-WEe1au0QNm5-bxLXSZ-39R7gtY-w59XJekEuUfZGkQCimfNdowky2hvH1eIB_OmIyeuK_mfTYaUj";

function parseCSVLine(text) {
  const result = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }

  result.push(cell.trim());
  return result;
}

async function fetchData(sheetName, sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?gid=${sheetId}&single=true&output=csv`;

  try {
    const response = await fetch(url);
    const csv = await response.text();
    console.log(sheetId, csv);

    // Split by newline but handle potential quoted newlines
    const rows = csv.split(/\r?\n/);
    const headers = parseCSVLine(rows[0]);
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue; // Skip empty rows

      const values = parseCSVLine(rows[i]);
      if (values.length !== headers.length) {
        console.warn(
          `Row ${i + 1} has incorrect number of columns. Expected: ${
            headers.length
          }, Got: ${values.length}`
        );
        continue;
      }

      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j].trim().toLowerCase();
        obj[header] = values[j];
      }

      // Only add if we have all required fields
      if (obj.question && obj.answer && obj["options 1"]) {
        data.push({
          question: obj.question,
          options: [
            obj["options 1"],
            obj["options 2"],
            obj["options 3"],
            obj["options 4"],
          ],
          answer: obj.answer,
        });
      }
    }
    quizData[sheetName] = data;
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu từ sheet ${sheetName}:`, error);
  }
}

async function loadQuizData() {
  await Promise.all(
    Object.keys(sheetIds).map(async (sheetName) => {
      await fetchData(sheetName, sheetIds[sheetName]);
    })
  );
  console.log(quizData);
}
