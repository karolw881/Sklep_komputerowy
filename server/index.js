const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');  //import pakietu cors


const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//dodaj middleware cors
app.use(cors());

app.get('/api/produkty', (req, res) => {
  db.query('SELECT id_produktu,nazwa,zdjecie,cena,kategoria,specyfikacje,opis FROM produkty', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/api/uzytkownicy', (req, res) => {
  db.query('SELECT id_uzytkownika,imie,email,login,haslo,rola FROM uzytkownicy', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/api/loginy_maile', (req, res) => {
  db.query('SELECT login,email FROM uzytkownicy', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/api/uzytkownicy', (req, res) => {
  const { imie, email, login, haslo } = req.body;
  
  const sql = "INSERT INTO uzytkownicy (imie, email, login, haslo) VALUES (?, ?, ?, ?)";
  db.query(sql, [imie, email, login, haslo], (err, result) => {
    if (err) throw err;
    res.send('Użytkownik został dodany do bazy danych.');
  });
});

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  db.query('SELECT * FROM uzytkownicy WHERE login = ? AND haslo = ?', [login, password], (err, results) => {
    if (err) throw err;
    if (results.length === 1) {
      const user = {
        id_uzytkownika: results[0].id_uzytkownika,
        imie: results[0].imie,
        email: results[0].email,
        login: results[0].login,
        rola: results[0].rola
      };
      res.status(200).json({ user });
    } else {
      res.sendStatus(401); // nieprawidłowe dane logowania
    }
  });
});

app.post('/api/emailChange', (req, res) => {
  const { email, id_uzytkownika} = req.body;
  
  const sql = "UPDATE uzytkownicy SET email = ? WHERE id_uzytkownika = ?";
  db.query(sql, [email, id_uzytkownika], (err, result) => {
    if (err) throw err;
    res.send('Email został zmieniony.');
  });
});

app.post('/api/passwordChange', (req, res) => {
  const { haslo, id_uzytkownika} = req.body;
  
  const sql = "UPDATE uzytkownicy SET haslo = ? WHERE id_uzytkownika = ?";
  db.query(sql, [haslo, id_uzytkownika], (err, result) => {
    if (err) throw err;
    res.send('Haslo zostało zmienione.');
  });
});

app.post('/api/oceny', (req, res) => {
  const { produkt_id } = req.body;
  db.query('SELECT o.opinia_id,o.tresc,o.ocena,u.imie FROM opinie o,uzytkownicy u WHERE o.produkt_id = ? AND o.uzytkownik_id = u.id_uzytkownika;', [produkt_id], (err, results) => {
    if (err) throw err;
    const oceny = results.map(result => ({
      id: result.opinia_id,
      tresc: result.tresc,
      ocena: result.ocena,
      imie: result.imie
    }));
    res.status(200).json(oceny);
  });
});



app.listen(port, () => {
  console.log(`Serwer uruchomiony na porcie ${port}`);
});
