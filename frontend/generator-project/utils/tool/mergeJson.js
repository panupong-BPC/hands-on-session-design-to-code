#!/usr/bin/env node

import fs from 'fs';

function isPlainObject(value) {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeValues(target, source) {
	if (Array.isArray(target) && Array.isArray(source)) {
		return [...target, ...source];
	}

	if (isPlainObject(target) && isPlainObject(source)) {
		const merged = { ...target };

		Object.entries(source).forEach(([key, value]) => {
			merged[key] = key in target ? mergeValues(target[key], value) : value;
		});

		return merged;
	}

	return source;
}

const targetFile = process.argv[2];
const sourceFile = process.argv[3];

if (!targetFile || !sourceFile) {
	console.error('Usage: mergeJson.js <target-file> <source-file>');
	process.exit(1);
}

const target = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

const merged = mergeValues(target, source);
fs.writeFileSync(targetFile, JSON.stringify(merged, null, 4));
