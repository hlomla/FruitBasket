let express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const fruits = require('./fruitBasket_FF');
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
} 

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/my_fruit_basket';

const pool = new Pool({
    connectionString,
    ssl:{ rejectUnauthorized: false}    
  });

  const FruitBasket = fruit(pool)

  let app = express()

  app.engine('handlebars', exphbs({ 
  partialsDir: "./views/partials", 
  viewPath: './views', 
  layoutsDir: './views/layouts' 
  }));
  
  app.set('view engine', 'handlebars');
  
  app.use(express.json());
  app.use(express.urlencoded());
  
  app.use(session({
      secret : "<add a secret string here>",
      resave: false,
      saveUninitialized: true
    }));

let PORT = process.env.PORT || 3555;

app.listen(PORT, function () {
        console.log("App started at PORT: ", PORT);
});    
  