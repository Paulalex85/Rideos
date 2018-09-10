#!/usr/bin/env bash

cd "/opt/eosio/bin/tests"
./init_test_account.sh
./init_order.sh

keyTester=$(openssl rand -hex 32)
keySeller=$(openssl rand -hex 32)

hashTester=$(echo -n $keyTester | xxd -r -p | sha256sum -b | awk '{print $1}')
hashSeller=$(echo -n $keySeller | xxd -r -p | sha256sum -b | awk '{print $1}')

cleos push action rideor initialize '["tester", "seller", "rider","50.0000 SYS", "20.0000 SYS"]' -p tester
cleos push action rideor validatebuy '["0", "'$hashTester'"]' -p tester
cleos push action rideor validatedeli '["0"]' -p rider
cleos push action rideor validatesell '["0", "'$hashSeller'"]' -p seller
sleep 1

cleos push action rideor initialize '["tester", "seller", "rider","50.0000 SYS", "20.0000 SYS"]' -p seller
cleos push action rideor validatesell '["1", "'$hashSeller'"]' -p seller
cleos push action rideor validatebuy '["1", "'$hashTester'"]' -p tester
cleos push action rideor validatedeli '["1"]' -p rider
sleep 1

cleos push action rideor initialize '["tester", "seller", "rider","50.0000 SYS", "20.0000 SYS"]' -p rider
cleos push action rideor validatedeli '["2"]' -p rider
cleos push action rideor validatesell '["2", "'$hashSeller'"]' -p seller
cleos push action rideor validatebuy '["2", "'$hashTester'"]' -p tester

cleos get table rideor rideor order