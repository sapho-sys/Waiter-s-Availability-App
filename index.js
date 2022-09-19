import express from "express";
const app = express();
import exphbs from "express-handlebars";
import session from "express-session";
import bodyParser from "body-parser";
import waitersRouters from "./routes/route.js";
import flash from "express-flash";
import dataFactory from "./data-factory.js";
// import displayFactory from "./display-factory.js";
import pgPromise from "pg-promise";

const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:sap123@localhost:5432/the_waiters';

const config = { 
	connectionString
}

if (process.env.NODE_ENV == 'production') {
	config.ssl = { 
		rejectUnauthorized : false
	}
}

const db = pgp(config);
const regiesDB = dataFactory(db);
// const myRegies = displayFactory();

let employeeRouter = waitersRouters(regiesDB);

//config express as middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//css public in use
app.use(express.static('public'));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: 'flash the mesaage',
    resave: false,
    saveUninitialized: true   
}));

// initialise the flash middleware
app.use(flash());
app.get('/', employeeRouter.defaultRoute);
app.post('/waiter',employeeRouter.postWaiter);
app.get('/waiters/:username', employeeRouter.getWaiter);
app.post('/shifts', employeeRouter.postDays);
app.get('/days', employeeRouter.getDays);
app.get('/reset', employeeRouter.resetInfo);


//start the server
const PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
    console.log("App running at http://localhost:" + PORT)
});