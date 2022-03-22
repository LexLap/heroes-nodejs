const express = require('express');
const cors = require('cors');
const usersRouter = require('./routers/usersRouter');
const heroesRouter = require('./routers/heroesRouter');

require('./db/mongoose');
const seedInitialData = require('./db/seed-data');
seedInitialData().then()

const port = process.env.PORT;
const app = express();


app.use(cors());
app.use(express.json());


app.use(usersRouter);
app.use(heroesRouter);




app.listen(port, () => console.log("Server is running on port:", port));