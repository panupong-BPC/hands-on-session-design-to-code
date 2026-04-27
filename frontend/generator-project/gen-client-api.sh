#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SPEC_DIR="${SCRIPT_DIR}/spec"
SWAGGER_DIR="${SCRIPT_DIR}/swagger"
MERGED_SPEC="${SPEC_DIR}/swagger.json"
OUTPUT_DIR="${PROJECT_ROOT}/api/client"

shopt -s nullglob
SWAGGER_FILES=("${SWAGGER_DIR}"/*.json)

if [ ${#SWAGGER_FILES[@]} -eq 0 ]; then
  echo "Error: no Swagger JSON files were found in ${SWAGGER_DIR}."
  exit 1
fi

rm -f "${MERGED_SPEC}"
cp "${SWAGGER_FILES[0]}" "${MERGED_SPEC}"

for swagger_file in "${SWAGGER_FILES[@]:1}"; do
  node "${SCRIPT_DIR}/utils/tool/mergeJson.js" "${MERGED_SPEC}" "${swagger_file}"
done

node "${SCRIPT_DIR}/utils/tool/cleanupSwagger.js" "${MERGED_SPEC}"

rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

GENERATOR_JAR=$(find /usr/local/lib/node_modules/@openapitools/openapi-generator-cli/versions/ -name "*.jar" | sort -V | tail -1 2>/dev/null || true)
GENERATOR_ARGS=(
  generate
  -i "${MERGED_SPEC}"
  -g typescript-fetch
  -o "${OUTPUT_DIR}"
  --skip-validate-spec
  --global-property apiDocs=false,modelDocs=false,apiTests=false,modelTests=false
  --additional-properties=typescriptThreePlus=true,useSingleRequestParameter=true,withInterfaces=true,withoutRuntimeChecks=true,modelPropertyNaming=original,enumPropertyNaming=original
)

if [ -n "${GENERATOR_JAR}" ]; then
  echo "Using openapi-generator: ${GENERATOR_JAR}"
  java -jar "${GENERATOR_JAR}" "${GENERATOR_ARGS[@]}"
else
  echo "openapi-generator jar not found, trying npx..."
  npx @openapitools/openapi-generator-cli "${GENERATOR_ARGS[@]}"
fi

echo "TypeScript API client has been successfully generated in ${OUTPUT_DIR}."
