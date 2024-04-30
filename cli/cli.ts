#! /usr/bin/env node
import { Command } from 'commander';
const program = new Command();

import { populateCountries, populateLanguages } from './actions/populate';

import { config } from 'dotenv';

config({ path: '.env' });

program
  .command('populate:languages')
  .description('Populate the database with all languages')
  .option('-f, --file <path>', 'File path override')
  .action(populateLanguages);

program
  .command('populate:countries')
  .description('Populate the database with all countries')
  .option('-f, --file <path>', 'File path override')
  .action(populateCountries);

program.parse(process.argv);
