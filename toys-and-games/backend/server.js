const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//-------------------------------------------------------------- openscreen sdk --
const { Openscreen } = require('@openscreen/sdk');

//------------------------------------------------------------------ middleware --
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// setting frontend build to a static folder.
app.use(express.static(path.join(__dirname, '../frontend/build')));

//--------------------------------------------------------- openscreen API keys --
const os = new Openscreen().config({
  key: process.env.OS_API_KEY,
  secret: process.env.OS_API_SECRET,
});

//------------------------------------------------------------- setup a project --
let projectId = process.env.OS_PROJECT_ID

//------------------------------------------------------------ get scan details --
let scanId;
app.get('/scan/:scanId', async (req, res) => {
  scanId = req.params.scanId;
  const scanObj = await os.scan(scanId).get();

  res.json(scanObj);
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/../frontend/build/index.html')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Listeing on port ${PORT}`));
