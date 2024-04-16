var express = require('express');
var router = express.Router();
const { Gateway, Wallets } = require('fabric-network');

var auditData= { auditId: '56756722.11', auditorId: 3000, companyId: 1, score: 1, evidence: 1};
auditJSON = JSON.stringify(auditData);

async function connectToNetwork() {
  const gateway = new Gateway();
  const walletPath = path.resolve(__dirname, 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const connectionProfile = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'connection.json'), 'utf8'));
  const connectionOptions = {
    wallet,
    identity: 'user1',
    discovery: { enabled: true, asLocalhost: true }
  };

  await gateway.connect(connectionProfile, connectionOptions);

  const network = await gateway.getNetwork('mychannel');
  const contract = network.getContract('audit');

  return { gateway, contract };
}  




router.post('/', async (req, res) => {
    const receivedData = req.body;
    var auditData = JSON.stringify(receivedData)
    try {
      const { gateway, contract } = await connectToNetwork();
    }
    catch(error){res.status(500).json({ success: false, message: error.message });}
    


    console.log(auditData);
    res.json(auditData);
  });




router.get('/:auditId', function(req, res, next) {
    console.log(req.params.auditId);
    res.json(auditData);
});

module.exports = router;
