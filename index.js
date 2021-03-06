require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const moment = require('moment');

const PORT = process.env.PORT || 3001;
const app = express();
const { Schema } = mongoose;


const now = () => moment().format('D MMM YYYY @ kk:mm:ss ');

// *** DATABASE & SCHEMA *** //

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('connected to db... 📀\n'));

const Ping = mongoose.model(
  'Ping',
  new Schema({
    created_at: { type: String, required: true },
    source: String,
  }),
);




// *** SERVER *** //


app.use(cors());



app.use('*', (req, res) => {
  const created_at = now();
  const source = JSON.stringify(req.headers);

  console.log(`🚨 pinged at ${created_at}...`);

  Ping.create({ created_at, source }, (err, ping) => {
    if (err || ping === null) {
      console.log('there was an error saving to database...');
    }
    console.log(ping);
  });
  res.sendStatus(200);
});





app.listen(PORT, () => console.log(`\nServer listening at port ${PORT}... 📡`));
