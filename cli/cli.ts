#! /usr/bin/env node
import { Command } from 'commander';
const program = new Command();

import { populate } from './actions/populate';

import { config } from 'dotenv';

config({ path: '.env' });

program
  .command('populatedb')
  .description('Populate the database with all countries and languages')
  .action(populate);

program.parse(process.argv);
