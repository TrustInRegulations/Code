var express = require('express');
var router = express.Router();

// GET-Anfrage für die Seite mit dem Formular
 router.get('/createAudit', (req, res) => {
 res.render('createAudit'); // Hier sollte dein Pug-Template-Dateiname stehen
});

// POST-Anfrage für das Formular
router.post('/', (req, res) => {
  const auditName = req.body.auditName;
  const auditScore = req.body.auditScore;
  const auditFile = req.body.auditFile;

console.log("hallo")
  
  res.render('index'); // Hier kannst du eine Bestätigung oder Weiterleitung rendern
});

module.exports = router;
