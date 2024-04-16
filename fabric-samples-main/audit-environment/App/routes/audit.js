/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';

const walletPath = path.join(__dirname, 'wallet');
const userId = 'admin';


var express = require('express');
var router = express.Router();

//*******

const nano = require('nano')('http://admin:admin@127.0.0.1:5985');
const db = nano.use('audits');


//**************** */



function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
	let skipInit = false;
	if (process.argv.length > 2) {
		if (process.argv[2] === 'skipInit') {
			skipInit = true;
		}
	}

	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

      //***************************************************************
		
        router.get('/:auditId', async function(req, res, next) {
        try {
            var result = await contract.submitTransaction('getAudit', req.params.auditId);
            console.log(req.params.auditId);
            res.send(prettyJSONString(result.toString()));
        }
        catch(error){res.status(500).json({ success: false, message: error.message });}
        });

		router.get('/', async function(req, res, next) {
			try {
				var result = await contract.submitTransaction('getAllAudits');
				console.log(req.params.auditId);
				res.send(prettyJSONString(result.toString()));
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

		router.get('/auditorScore/:auditorId', async function(req, res, next) {
			try {
				var result = await contract.evaluateTransaction('getAuditorScore', req.params.auditorId);
				console.log(req.params.auditId);
				
				res.send(prettyJSONString(result.toString()));
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

		router.get('/companyScore/:companyId', async function(req, res, next) {
			try {
				var result = await contract.submitTransaction('getCompanyScore', req.params.companyScore);
				console.log(req.params.auditId);
				res.send(prettyJSONString(result.toString()));
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

		router.get('/history/:auditId', async function(req, res, next) {
			try {
				var result = await contract.submitTransaction('getHistoryByKey', req.params.auditId);
				console.log(req.params.auditId);
				res.send(prettyJSONString(result.toString()));
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

        router.post('/', async function(req, res) {
			const receivedData = req.body;
			var auditData = JSON.stringify(receivedData)
			const uuid = uuidv4();


        try {
            await contract.submitTransaction('createAudit', uuid, receivedData.companyId, "", "", "", "", receivedData.deadline, "");
            console.log(auditData);
            res.json({success: true, auditId: uuid});
        }
        catch(error){res.status(500).json({ success: false, message: error.message });}

        
        });

		router.put('/', async function(req, res) {
			const receivedData = req.body;
			var auditData = JSON.stringify(receivedData)
			try {
				await contract.submitTransaction('updateAudit', receivedData.auditId, receivedData.score, receivedData.evidence, receivedData.description, receivedData.date, receivedData.deadline);
				console.log(auditData);
				res.json({success: true});
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
			});


		router.put('/companyScore/', async function(req, res) {
			const receivedData = req.body;
			var auditData = JSON.stringify(receivedData)
			console.log(receivedData.auditId)
			try {
				await contract.submitTransaction('updateCompanyScore', receivedData.auditId, receivedData.score);
				console.log(auditData);
				res.json({success: true});
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});
            
		router.put('/evidence/', async function(req, res) {
			const receivedData = req.body;
			var auditData = JSON.stringify(receivedData)
			const hash = crypto.createHash('sha256');
  			hash.update(receivedData.evidence);
  			var evidenceHash = String(hash.digest('hex'));

			// create new document off-chain database
			const document = {
			auditId: receivedData.auditId,
			evidence: receivedData.evidence
			};
			
			//insert off-chain-database
			db.insert(document, function(err, body, header) {
			if (err) {
				console.log('Error Offchain-database:', err.message);
				return;
			}
			
			console.log('Offchain-Evidence Successful', body);
			});


			try {
				await contract.submitTransaction('updateEvidence', receivedData.auditId,  evidenceHash);
				console.log(auditData);
				res.json({success: true});
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

		router.put('/description/', async function(req, res) {
			const receivedData = req.body;
			var auditData = JSON.stringify(receivedData)
			try {
				await contract.submitTransaction('updateDescription', receivedData.auditId, receivedData.description);
				console.log(auditData);
				res.json({success: true});
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

		router.put('/auditorScore/', async function(req, res) {
			const receivedData = req.body;
			var auditData = JSON.stringify(receivedData)
			try {
				await contract.submitTransaction('updateAuditorScore', receivedData.auditId, receivedData.auditorScore);
				console.log(auditData);
				res.json({success: true});
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

		router.put('/deadline/', async function(req, res) {
			const receivedData = req.body;
			var auditData = JSON.stringify(receivedData)
			try {
				await contract.submitTransaction('updateDeadline', receivedData.auditId, receivedData.deadline);
				console.log(auditData);
				res.json({success: true});
			}
			catch(error){res.status(500).json({ success: false, message: error.message });}
		});

      
      //***************************************************************


		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}

	console.log('*** application ready');

}
module.exports = router;


main();
