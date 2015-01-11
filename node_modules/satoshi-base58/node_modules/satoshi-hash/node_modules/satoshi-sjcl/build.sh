#!/usr/bin/env bash

SJCL_SRC=node_modules/sjcl/sjcl.js
LIB_SRC=$(find ./lib -name "*.js")

# Build only the SJCL modules we use
(
  cd node_modules/sjcl/
  ./configure --with-all --without-cbc --without-gcm --without-ocb2 --without-sha1 --without-srp --compress=none
  make
)

# Concatenate SJCL with our extensions
mkdir -p dist
./node_modules/.bin/uglifyjs $SJCL_SRC $LIB_SRC -b --output dist/satoshi-sjcl.js
