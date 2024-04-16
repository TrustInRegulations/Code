# A Blockchain-based Trust and Reputation System for Identity and Access Management Regulations

This code is part of our anonymous conference submission. 

The code is based on the [Hyperledger Fabric Tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/whatis.html).

In the following section the setup is explained.

# Hyperledger Fabric Network Setup

1. Navigate to fabric-samples-main:
   ```
   cd fabric-samples-main
   ```
   
2. Download Hyperledger Fabric Binaries:
   ```
   curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
   ```
3. Install Binaries:
   ```
   ./install-fabric.sh docker samples binary
   ```

4. Navigate to test-network folder in fabric-samples:
   ```
   cd test-network
   ```
   
5. Start network:
   ```
   ./network.sh up createChannel -c mychannel -ca -s couchdb
   ```
6. Deploy chaincode:
   ```
   ./network.sh deployCC -ccn basic -ccp ../audit-environment/chaincode-javascript/ -ccl javascript
   ```
7. Check in Docker if everything is running properly.

# CouchDB Offchain-Storage Setup

1. Navigate to audit-environment/offchain-storage:
   ```
   cd ../audit-environment/offchain-storage
   ```

2. Start CouchDB Docker Image:
   ```
   docker-compose up -d
   ```
   
# Server Setup

1. Navigate to App
   ```
   cd ../App
   ```
3. Install packages:
   ```
   npm install
   ```
4. Start server:
    ```
    npm start
    ```
5. Open Swagger documetation:
    ```
    http://localhost:3000/docs/#/
    ```
