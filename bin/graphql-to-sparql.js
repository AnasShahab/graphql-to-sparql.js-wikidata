#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const minimist = require("minimist");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const Converter_1 = require("../lib/Converter");
// console.log(process.argv)
const args = minimist(process.argv.slice(2));
// console.log(args)
const homeDir=require('os').homedir();
const desktop=`${homeDir}/Desktop`;
if (args._.length !== 2 || args.h || args.help) {
    if(args._.length !== 1) {
        process.stderr.write('usage: graphql-to-sparql [--help] context query\n' +
            '  context should be a JSON object, e.g.\n' +
            '      { "hero": "http://example.org/hero", "name": "http://example.org/name" }\n' +
            '    or the path to such a query\n' +
            '  query should be a GraphQL query, e.g.\n' +
            '      { hero { name } }\n' +
            '    or the path to such a JSON file\n');
        // console.log(args._[0])
        process.exit(1);
    }
    else {
        process.stderr.write('Default context at Desktop --> contextD.jsonld is being used\n');
        // console.log(args._[0])
        // args._.push(args._[0])
        args._.unshift(`${desktop}/contextD.jsonld`)
        // console.log(args)
        // process.exit(1);
    }
}
// console.log(args)
// allow both files as direct JSON objects for context
const context = JSON.parse(fs.existsSync(args._[0]) ? fs.readFileSync(args._[0], 'utf8') : args._[0]);
const query = fs.existsSync(args._[1]) ? fs.readFileSync(args._[1], 'utf8') : args._[1];
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        process.stdout.write((0, sparqlalgebrajs_1.toSparql)(yield new Converter_1.Converter().graphqlToSparqlAlgebra(query, context)) + '\n');
    });
}
run();
//# sourceMappingURL=graphql-to-sparql.js.map