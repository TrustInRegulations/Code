document.addEventListener('DOMContentLoaded', function() {

    var submitBtn = document.getElementById('submitBtn');

    
    submitBtn.addEventListener('click', function(event) {
      event.preventDefault();
      var auditName = document.getElementById('auditName').value;
      var auditScore = document.getElementById('auditScore').value;
      var auditFile = document.getElementById('auditFile').value;
      
      var fileHash = handleFile().
      console.log('Hash der fhDatei:', fileHash);
      requestData = { auditId: auditName, auditorId: 1, companyId: 1, evidence: fileHash, score: auditScore};
    
      fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Weitere Header können hier hinzugefügt werden
        },
        body: JSON.stringify(requestData)
      })
        .then(response => {
          // Überprüfe, ob die Antwort erfolgreich ist (Statuscode 200-299)
          if (!response.ok) {
            throw new Error(`HTTP-Fehler! Statuscode: ${response.status}`);
          }
          // Parsen der JSON-Daten
          return response.json();
        })
        .then(data => {
          // Verarbeite die empfangenen Daten
          console.log('Empfangene Daten:', data);
        })
        .catch(error => {
          // Behandle Fehler
          console.error('Fehler beim Fetch-Aufruf:', error);
        });
      
    

    });

    function handleFile() {
        return new Promise((resolve, reject) => {
          var fileInput = document.getElementById('auditFile');
    
          if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();
    
            reader.onload = async function(e) {
              var fileContent = e.target.result;
              var hash = await hashString(fileContent);
              resolve(hash);
            };
    
            reader.readAsText(file);
          } else {
            reject(new Error('Keine Datei ausgewählt.'));
          }
        });
      }
    
      async function hashString(inputString) {
        var encoder = new TextEncoder();
        var data = encoder.encode(inputString);
        var hashBuffer = await crypto.subtle.digest('SHA-256', data);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        var hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
      }
 
  });


