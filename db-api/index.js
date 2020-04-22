var app = require('express')();
var mysql = require('mysql');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var fs = require('fs');

app.use(cors());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});


//------------login-------------------



app.post('/user/login_user/', function (req, res) {
    var first_name = req.body.first_name;
    var password = req.body.password;
    connection.query("select first_name, password from user where first_name='" + first_name + "'", function (err, rows, fields) {
        console.log(password);
        console.log(rows[0].password);

        if (rows[0].password == password) {
            res.send({
                "msg": "Accepted"
            });
        }
        else {
            res.send({
                "msg": "Wrong Password"
            });
        }
    })
});


//-addbook-----------------------------------



app.post('/book/add_book', function (req, res) {
    var name = req.body.name;
    var author = req.body.author;
    var kind = req.body.kind;
    var year = req.body.year;
    var link = null;
    var description=req.body.description;


    var sql = "insert into `book` (`name`,`author`,`kind`,`year`,`link`,`description`) values (?,?,?,?,NULL,?)";
    var values = [name, author, kind, year,description];
    connection.query(sql, values, function (err, rows, fields) {
        console.log(err);
        console.log(rows);
        res.send({
            "msg": "New Book Added"
        });

    })
});

//-----search-----------------
app.get('/book/get_one/:name', function (req, res) {
    var name = req.params.name;
    console.log(name);
    connection.query('SELECT * from book' + name, function (err, rows, fields) {
        //console.log(rows);
        res.send(rows);
    })
});
//-----get kind -------------


app.get('/books/get_kind/:kind', function (req, res) {
    var kind = req.params.kind;
    console.log(kind);
    connection.query("select * from book where kind='" + kind + "'", function (err, rows, fields) {
        console.log(err);
        console.log(rows);
        res.send(rows);
    })
});


//---getbook--------------------------------

app.get('/book/get_all/', function (req, res) {
    debugger;
    console.log("req" +req);
    console.log("res" +res);

    //var name=req.params.name;
    //console.log(name);
    connection.query('SELECT * from book;', function (err, rows, fields) {
        console.log("rows: " + rows + " fields: " + fields);
        res.send(rows);
        console.log(err);
    })
    
});

//----getuser------------------------------

app.get('/user/get_all', function (req, res) {
    connection.query('SELECT * from user;', function (err, rows, fields) {
        res.send(rows);
    })
});

//---adduser-------------------------------------

app.post('/user/add_user', function (req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var password = req.body.password;
    var sql = "insert into `user` (`id`,`first_name`,`last_name`,`password`) values (NULL,?,?,?)";
    var values = [first_name, last_name, password];
    connection.query(sql, values, function (err, rows, fields) {
        res.send({
            "msg": "New User Added"
        });

    })
});

//------------------------



/*
Serve files
*/
 /*
    serve files from the server
    */
   var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    mp4: 'image/mp4',
    mp3: 'image/mp3',
    ogg: 'image/ogg',
    mpeg: 'image/mpeg',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    js: 'application/javascript'
};
app.get('*', function (req, res) {
    var file = path.join(__dirname, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(__dirname + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
	
	console.log(file);
	
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
	
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function (err) {
        res.send({
            status: -1,
            message_id: 40,
            message: "URL NOT FOUND!"
        });
    });
});

http.listen(4100, function () {
    console.log('listening on localhost:4100');
});