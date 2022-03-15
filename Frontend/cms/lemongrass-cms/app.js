const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const swaggerJSDoc = require('swagger-jsdoc');
const https = require('https');
const session = require('express-session');
const initialUserModule = require( "./server/Infrastructure/InitialUserModule" );
const initialUser = new initialUserModule();
//add config ssl for HTTPS
const fs = require('fs');
const httpsOptions = {
  key: fs.readFileSync('./config/sslConfig/key.pem'),
  cert: fs.readFileSync('./config/sslConfig/certificate.pem')
}
const dbUtils = require('./server/lib/db');
//const drinkType = require('./server/api/drinkType')
//const drinkTemperature = require('./server/api/drinkTemperature')
const api = require('./server/api/index');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//view engine
app.set('views', path.join(__dirname, './server/views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: 'true',
  saveUninitialized: 'true',
  secret: 'keyboard cat'
}));

// app.use('/api/drink-type', drinkType)
// app.use('/api/drink-temperature', drinkTemperature)
app.use(api);
// Handles load laguage file
app.get('/locales/:language/translations.json', (req, res) => {
  res.sendFile(path.join(__dirname + '/locales/' + req.param('language') + '/translations.json'));
});
//render view swagger
app.get('/swagger', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/public/api-docs/index.html'))
});

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Lemon Grass Swagger API',
    version: '1.0.0',
    description: 'Describe a RESTful API of lemon grass CMS',
  },
  host: process.env.BASE_URL,
  basePath: '/',
  schemes: ['https', 'http'],
  tags: [],
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./server/api/*.js'], // pass all in array
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(swaggerSpec);
});

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.enable('trust proxy');
app.use(function (req, res, next) {
  if (req.secure || process.env.BLUEMIX_REGION === undefined) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/dist/index.html'));
})

process.on('uncaughtException', function(error) {
  // do something clever here
});
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
});

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});

// set app port
app.set('port', process.env.PORT || 443);

dbUtils.connect(() => {
  initialUser.Initialize();
  https.createServer(httpsOptions, app).listen(443, () => {
    console.log('server running at ' + 443)
  })
});
