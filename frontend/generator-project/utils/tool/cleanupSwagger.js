#!/usr/bin/env node

import fs from 'fs';

// Receive file name from argument.
const swaggerFilePath = process.argv[2];
if (!swaggerFilePath) {
    console.error('Please provide the swagger file path as an argument.');
    process.exit(1);
}

fs.readFile(swaggerFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading swagger file:', err);
        return;
    }

    let swagger;
    try {
        swagger = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing swagger JSON:', parseErr);
        return;
    }

    // Remove gateway-injected authorization parameters from merged specs.
    const removeAuthorizationParam = (parameters) => {
        if (!Array.isArray(parameters)) return parameters;
        return parameters.filter((param) => param.name !== 'Authorization');
    };

    // Function to remove duplicate array members in an object
    const removeDuplicateArrayMembers = (array) => {
        if (!Array.isArray(array)) return array;
        return array.filter((item, index) => {
            return array.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(item)) === index;
        });
    };

    // Recursive function to traverse through the JSON and remove duplicate array members
    const traverseAndRemoveDuplicates = (obj) => {
        if (Array.isArray(obj)) {
            return removeDuplicateArrayMembers(obj).map(traverseAndRemoveDuplicates);
        } else if (typeof obj === 'object' && obj !== null) {
            Object.keys(obj).forEach((key) => {
                obj[key] = traverseAndRemoveDuplicates(obj[key]);
            });
        }
        return obj;
    };

    // Traverse the swagger object to remove duplicates
    swagger = traverseAndRemoveDuplicates(swagger);

    // Iterate through all paths and methods to remove authorization duplicates.
    if (swagger.paths) {
        Object.keys(swagger.paths).forEach((path) => {
            const methods = swagger.paths[path];
            Object.keys(methods).forEach((method) => {
                if (methods[method].parameters) {
                    methods[method].parameters = removeAuthorizationParam(
                        methods[method].parameters
                    );
                }
                if (methods[method].responses) {
                    Object.keys(methods[method].responses).forEach((statusCode) => {
                        const response = methods[method].responses[statusCode];
                        if (response.headers) {
                            response.headers = removeAuthorizationParam(response.headers);
                        }

                        // Remove application/json if content type */* exists in 200 responses
                        if (
                            statusCode === '200' &&
                            response.content &&
                            response.content['*/*'] &&
                            response.content['application/json']
                        ) {
                            delete response.content['application/json'];
                        }
                    });
                }
            });
        });
    }

    // Write the updated swagger JSON to the same file
    fs.writeFile(swaggerFilePath, JSON.stringify(swagger, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing updated swagger file:', writeErr);
        } else {
            console.log('Updated swagger file has been saved as', swaggerFilePath);
        }
    });
});
