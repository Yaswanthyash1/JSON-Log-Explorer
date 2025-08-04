const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.static(__dirname)); // serve index.html

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const content = fs.readFileSync(filePath, 'utf-8');

  let logs = [];
  try {
    if (content.trim().startsWith('[')) {
      logs = JSON.parse(content); // JSON array
    } else {
      logs = content.trim().split('\n').map(line => JSON.parse(line)); // NDJSON
    }
  } catch (err) {
    return res.status(400).send('Invalid JSON file');
  }

  res.json({ count: logs.length, logs: logs.slice(0, 100) });
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
