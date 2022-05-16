var express = require('express');
var bcrypt = require('bcrypt')
var bodyParser = require('body-parser')
var app = express();

app.set('view engine', 'ejs');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var savedHash;

// Rendu de la page index
app.get('/', function(req, res) {
    res.render('pages/index');
});

// Rendu de la page ex1
app.get('/ex1', function(req, res) {
    res.render('pages/ex1', {
        plaintext: '',
        salt: '',
        hash: ''
    });
});

// Rendu de la page ex2
app.get('/ex2', function(req, res) {
    res.render('pages/ex2', {
        times: []
    });
});

// Rendu de la page ex5
app.get('/ex5', function(req, res) {
    res.render('pages/ex5', {
        times: []
    });
});

// Rendu de la page ex9
app.get('/ex9', function(req, res) {
    res.render('pages/ex9', {
        valid: ''
    });
});

// Rendu de la page ex10
app.get('/ex10', function(req, res) {
    res.render('pages/ex10', {
        times: []
    });
});

// Calcul de la page ex1
app.post('/ex1',  urlencodedParser, function (req, res) {
    // Génération du sel avec facteur de cout 16
    bcrypt.genSalt(16, function(err, salt) {
        // Hashage du mot de passe avec le sel généré
        bcrypt.hash(req.body.plaintext, salt, function(err, hash) {
            savedHash = hash;

            // Rendu
            res.render('pages/ex1', {
                plaintext: req.body.plaintext,
                salt: salt,
                hash: hash
            })
        })
    })
})

// Calcul de la page ex2
app.post('/ex2',  urlencodedParser, function (req, res) {

    var times = []
    for(let i = 4; i<=23; i++) {
        let t0 = performance.now();
        let salt = bcrypt.genSaltSync(i); // Salage avec facteur de cout i
        let t1 = performance.now();
        let hash = bcrypt.hashSync(req.body.plaintext, salt); // Hashage avec sel généré
        let t2 = performance.now();
    
        let timeToSalt = t1-t0;
        let timeToHash = t2-t1;

        times.push({
            timeToSalt: timeToSalt,
            timeToHash: timeToHash
        });
        console.log(i)
        console.log(times)
    }

    // Rendu
    res.render('pages/ex2', {
        times: times
    })
})

// Calcul pour la page ex5
app.post('/ex5',  urlencodedParser, function (req, res) {

    var times = []
    var chain = "aaa" // Chaine de base
    let t0 = performance.now();
    let salt = bcrypt.genSaltSync(parseInt(req.body.rounds)); // Génération d'un sel basé sur le facteur de cout fourni (inutile de le recalculer par la suite)
    let t1 = performance.now();
    let timeToSalt = t1-t0;
    for(let i = 4; i<=15; i++) {
        chain += "a";
        let t2 = performance.now();
        let hash = bcrypt.hashSync(chain, salt); // Hashage avec sel généré
        let t3 = performance.now();
        let timeToHash = t3-t2;
        times.push({
            chain: chain,
            timeToSalt: timeToSalt,
            timeToHash: timeToHash
        });
        console.log(i)
        console.log(times)
    }

    // Rendu
    res.render('pages/ex5', {
        times: times
    })

})

// Calcul de la page ex9
app.post('/ex9',  urlencodedParser, function (req, res) {
    var valid = bcrypt.compareSync(req.body.password, savedHash); // Comparaison du hash et du mot de passe

    // Rendu
    res.render('pages/ex9', {
        valid: valid
    })
})

// Calcul de la page ex10
app.post('/ex10', urlencodedParser, function (req, res) {
    // Hash de base, sans la partie liée au sel pour pouvoir augmenter le facteur de cout sans devoir recalculer un hash
    var BASE_HASH = "$IDOwioZJapO/RbUqJkxH0uZ0gEHxcuvCJ4OkrT4KyHKlfSKCOh1qa" 

    var times = [];
    for(let i = 4; i <= 15; i++) {
        hash = "$2b$"+String(i).padStart(2, "0")+BASE_HASH; // affectation d'un facteur de cout
        let t0 = performance.now();
        var valid = bcrypt.compareSync(req.body.plaintext, hash); // Comparaison du mot de passe et du hash, le résultat ne nous interesse pas
        let t1 = performance.now();
        let timeToCompare = t1-t0;

        times.push({
            timeToCompare: timeToCompare
        })

        console.log(i)
        console.log(times)
    }

    // Rendu
    res.render('pages/ex10', {
        times: times
    })
})



app.listen(8080);
console.log('8080 is the magic port');