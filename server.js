const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '/dist/titlebot'))); // serve these files


app.post('/lookup', (req, res) => {
  if (req.body && req.body.data) {
    axios.get(req.body.data)
      .then((response) => {
        if (response.data) {
          let tag = response.data.match(/(<title.*>).*(<\/title>)/)[0];
          let title = tag.match(/(?:<title.*>)(.*)(?:<\/title>)/)[1];
          res.status(200).send({ title: title });
        } else {
          res.status(204).send("No html available")
        }
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  } else {
    res.status(204).send("No data sent with request");
  }
});

app.get('/', (req, res) => {
  res.status(200).sendFile("index.html");
});

app.get('*', (req, res) => {
  console.log(app._router.stack);
  res.status(404);
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});