const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();

const pat = path.join(__dirname, 'public/index.html');
//console.log(pat);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(pat);
});

app.post('/register', (req, res) => {
    console.log(req.body);

    let dbs = JSON.parse(fs.readFileSync(path.join(__dirname, 'databases', 'db.json'), 'utf-8'));
    if (req.body.password != req.body.cpassword) {
        return res.send("password and confirmpassword are not match");
    }
    /*if(req.body.phone<10){
        return res.send("please valid phone number");
    }*/
    dbs.push({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
    });
    fs.writeFileSync(path.join(__dirname, 'databases', 'db.json'), JSON.stringify(dbs, null, 2));
    console.log('data saved')
    res.send("your regitration successful ");
})

app.post('/login', (req, res) => {
    console.log(req.body);
    let dbs = JSON.parse(fs.readFileSync(path.join(__dirname, 'databases', 'db.json'), 'utf-8'));
    //console.log(dbs);
    for (i = 0; i < dbs.length; i++) {
        if (req.body.email == dbs[i].email && req.body.password == dbs[i].password) {
            console.log('successfull');
            return res.send(' login successfull');
        }
    }
    res.send('Password not match');
})

app.post('/forgot', (req, res) => {
    console.log(req.body);
    let dbs = JSON.parse(fs.readFileSync(path.join(__dirname, 'databases', 'db.json'), 'utf-8'));
    for (i = 0; i < dbs.length; i++) {
        if (req.body.email == dbs[i].email) {
            dbs[i].password = req.body.password;
            //dbs[i].cpassword = dbs[i].password;
            fs.writeFileSync(path.join(__dirname, 'databases', 'db.json'), JSON.stringify(dbs, null, 2));
            console.log('successfull');
            return res.send('password change successful');
        }
    }
    res.send('please enter valid email addrass');
})

app.post('/delete', (req, res) => {
    let dbs = JSON.parse(fs.readFileSync(path.join(__dirname, 'databases', 'db.json'), 'utf-8'));
    for (i = 0; i < dbs.length; i++) {
        if (dbs[i].email == req.body.email && dbs[i].password == req.body.password) {
            delete dbs[i];
            fs.writeFileSync(path.join(__dirname, 'databases', 'db.json'), JSON.stringify(dbs.filter(a => a != null), null, 2));
            console.log('sucessful');
            return res.send('deleted account');
        }
    }
    res.send('please enter valid email addrass and password');
})

const host = '192.168.43.184'
app.listen(8081, () => {
    console.log('listenting to the port 8081')
});
