'use strict';

const { Contract } = require('fabric-contract-api');

class AuditChaincode extends Contract {

    async auditExists(ctx, auditId) {
        // ==== Check if asset already exists ====
        let auditState = await ctx.stub.getState(auditId);
        return auditState && auditState.length > 0;
    }

    async createAudit(ctx, auditId, companyId, companyScore, evidence, description, date, deadline, auditorScore) {
        const auditorId ="";
        const exists = await this.auditExists(ctx, auditId);
		if (exists) {
			throw new Error(`The asset ${auditId} already exists`);
		}
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP') {
            throw new Error('No permission');
        }

        const audit = {
            auditorId,
            companyId,
            companyScore,
            evidence,
            description,
            date,
            deadline,
			auditorScore
        };

        await ctx.stub.putState(auditId, Buffer.from(JSON.stringify(audit)));
    }

    async getAudit(ctx, auditId) {
        const auditAsBytes = await ctx.stub.getState(auditId);
        
        if (!auditAsBytes || auditAsBytes.length === 0) {
            throw new Error(`Audit with ID ${auditId} does not exist`);
        }
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP' && clientIdentity.getMSPID() !== 'Org2MSP' && clientIdentity.getMSPID() !== 'Org3MSP') {
            throw new Error('No permission');
        }
        return JSON.stringify(JSON.parse(auditAsBytes.toString('utf8')));

    }

	
	async getAllAudits(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = [];
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP' && clientIdentity.getMSPID() !== 'Org2MSP' && clientIdentity.getMSPID() !== 'Org3MSP') {
            throw new Error('No permission');
        }
        while (true) {
            const result = await iterator.next();
            if (result.value && result.value.value.toString()) {
                results.push(JSON.parse(result.value.value.toString('utf8')));
            }
            if (result.done) {
                await iterator.close();
                return JSON.stringify(results);
            }
        }
    }

    
	async updateCompanyScore(ctx, auditId, score) {

		const auditAsBytes = await ctx.stub.getState(auditId);
        
        if (!auditAsBytes || auditAsBytes.length === 0) {
            throw new Error(`Audit with ID ${auditId} does not exist`);
        }
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP' && clientIdentity.getMSPID() !== 'Org2MSP') {
            throw new Error('No permission');
        }
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(auditAsBytes.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + auditId;
			throw new Error(jsonResp);
		}
		assetToTransfer.companyScore = score;

		let assetJSONasBytes = Buffer.from(JSON.stringify(assetToTransfer));
		await ctx.stub.putState(auditId, assetJSONasBytes); 
	}
	async updateEvidence(ctx, auditId, updateEvidence) {
        var auditorId = ctx.clientIdentity.getID().toString();
		const auditAsBytes = await ctx.stub.getState(auditId);
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP' && clientIdentity.getMSPID() !== 'Org2MSP') {
            throw new Error('No permission');
        }
        if (!auditAsBytes || auditAsBytes.length === 0) {
            throw new Error(`Audit with ID ${auditId} does not exist`);
        }
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(auditAsBytes.toString()); 
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + auditId;
			throw new Error(jsonResp);
		}
		assetToTransfer.evidence = evidence;

        assetToTransfer.auditorId = auditorId;

		let assetJSONasBytes = Buffer.from(JSON.stringify(assetToTransfer));
		await ctx.stub.putState(auditId, assetJSONasBytes); 
	}
	async updateDescription(ctx, auditId, description) {

		const auditAsBytes = await ctx.stub.getState(auditId);
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP' && clientIdentity.getMSPID() !== 'Org2MSP') {
            throw new Error('No permission');
        }
        
        if (!auditAsBytes || auditAsBytes.length === 0) {
            throw new Error(`Audit with ID ${auditId} does not exist`);
        }
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(auditAsBytes.toString()); 
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + auditId;
			throw new Error(jsonResp);
		}
		assetToTransfer.description = description;

		let assetJSONasBytes = Buffer.from(JSON.stringify(assetToTransfer));
		await ctx.stub.putState(auditId, assetJSONasBytes); 
	}
	async updateDeadline(ctx, auditId, deadline) {

		const auditAsBytes = await ctx.stub.getState(auditId);
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP') {
            throw new Error('No permission');
        }
        if (!auditAsBytes || auditAsBytes.length === 0) {
            throw new Error(`Audit with ID ${auditId} does not exist`);
        }
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(auditAsBytes.toString());
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + auditId;
			throw new Error(jsonResp);
		}
		assetToTransfer.deadline = deadline;

		let assetJSONasBytes = Buffer.from(JSON.stringify(assetToTransfer));
		await ctx.stub.putState(auditId, assetJSONasBytes); 
	}
	async updateAuditorScore(ctx, auditId, auditorScore) {

		const auditAsBytes = await ctx.stub.getState(auditId);
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP' && clientIdentity.getMSPID() !== 'Org3MSP') {
            throw new Error('No permission');
        }
        if (!auditAsBytes || auditAsBytes.length === 0) {
            throw new Error(`Audit with ID ${auditId} does not exist`);
        }
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(auditAsBytes.toString()); 
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + auditId;
			throw new Error(jsonResp);
		}
		assetToTransfer.auditorScore = auditorScore;

		let assetJSONasBytes = Buffer.from(JSON.stringify(assetToTransfer));
		await ctx.stub.putState(auditId, assetJSONasBytes);
	}

	async getHistoryByKey(ctx, key) {
        const iterator = await ctx.stub.getHistoryForKey(key);
        const history = [];
        const clientIdentity = ctx.clientIdentity;
        if (clientIdentity.getMSPID() !== 'Org1MSP' && clientIdentity.getMSPID() !== 'Org2MSP' && clientIdentity.getMSPID() !== 'Org3MSP') {
            throw new Error('No permission');
        }
        while (true) {
            const item = await iterator.next();

            if (item.value && item.value.value.toString()) {
                const record = JSON.parse(item.value.value.toString('utf8'));
                /*const record = {
                    value: item.value.value.toString('utf8'),
                    txId: item.value.tx_id
                };*/

                history.push(record);
            }

            if (item.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(history);
    }

	async getAuditorScore(ctx, auditorId) {
        const iterator = await ctx.stub.getQueryResult(`{"selector":{"auditorId":"${auditorId}"}}`);
        const scores = [];
        var avg = 0;
        var count = 0;
        var sum = 0;
        while (true) {
            const result = await iterator.next();
            
            if (result.value && result.value.value.toString()) {
                const score = JSON.parse(result.value.value.toString('utf8'));
                scores.push(score.auditorScore);
            }
            if (result.done) {
                await iterator.close();
                for (let i = 0; i < scores.length; i++) {
                    if (scores[i] !== "") {
                        sum += parseInt(scores[i], 10);
                        count++;
                    }
                }
                avg = sum / count;
                return JSON.stringify(avg);
            }
        }
    }
	async getCompanyScore(ctx, companyId) {
        const iterator = await ctx.stub.getQueryResult(`{"selector":{"companyId":"${companyId}"}}`);
        const scores = [];
        var avg = 0;
        var count = 0;
        var sum = 0;
        while (true) {
            const result = await iterator.next();

            if (result.value && result.value.value.toString()) {
                const score = JSON.parse(result.value.value.toString('utf8'));
                scores.push(score.companyScore);
            }

            if (result.done) {
                await iterator.close();
                for (let i = 0; i < scores.length; i++) {
                    if (scores[i] !== "") {
                        sum += parseInt(scores[i], 10);
                        count++;
                    }
                }
                avg = sum / count;
                return JSON.stringify(avg);
            }
        }
    }

}

    


module.exports = AuditChaincode;