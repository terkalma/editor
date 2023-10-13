#!/bin/bash

# Check if a parameter was provided
if [ -z "$1" ]; then
  echo "Error: No parameter provided. Please provide a value as an argument."
  exit 1
fi

# Validate the parameter
valid_parameters=("sandbox" "production")
parameter="$1"

if [[ ! " ${valid_parameters[*]} " =~ " ${parameter} " ]]; then
  echo "Error: Invalid parameter. Please use one of the following: ${valid_parameters[*]}"
  exit 1
fi

if [ "$parameter" == "sandbox" ]; then
 export FMS_ENV="sandbox"
  export S3_BUCKET="cimbadmin-sandbox"
  export CF_DISTRIBUTION_ID=""
  export API_URL="https://sandbox.api.example.com"
elif [ "$parameter" == "production" ]; then
  export FMS_ENV="production"
  export S3_BUCKET="cimbadmin-production"
  export CF_DISTRIBUTION_ID="E23I4T6Q6WFCB7"
fi

# Run the deployment script
npm run build
aws s3 sync dist/ s3://$S3_BUCKET --delete
aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths "/*"
