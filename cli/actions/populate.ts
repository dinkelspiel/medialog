import { existsSync, readFileSync } from 'fs';
import prisma from '../../server/db';
import logger from '@/server/logger';

export const populateCountries = async (options: {
  file: string | undefined;
}) => {
  let dataString;
  if (!options.file) {
    const endpointUrl: string = 'https://query.wikidata.org/sparql';
    const sparqlQuery: string = `SELECT ?countryLabel ?isoCode
    WHERE {
      ?country wdt:P31 wd:Q3624078.
      ?country wdt:P297 ?isoCode.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    `;

    const fullUrl: string =
      endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);
    const headers: { [key: string]: string } = {
      Accept: 'application/sparql-results+json',
    };

    logger.info(`Fetching: ${fullUrl}`);

    dataString = await (await fetch(fullUrl, { headers })).json();
  } else {
    if (!existsSync(options.file)) {
      logger.error("File doesn't exist");
      return;
    }

    dataString = JSON.parse(readFileSync(options.file, 'utf8'));
  }
  const data = dataString['results']['bindings'] as any[];

  logger.info('Populating countries and languages...');

  for (const entry of data) {
    const country = await prisma.country.findFirst({
      where: {
        iso_3166_1: entry.isoCode.value,
      },
    });

    if (country === null) {
      await prisma.country.create({
        data: {
          name: entry.countryLabel.value,
          iso_3166_1: entry.isoCode.value,
        },
      });

      logger.info(`${entry.countryLabel.value} ${entry.isoCode.value}`);
    }
  }

  logger.info('Done populating countries and languages!');
};

export const populateLanguages = async (options: {
  file: string | undefined;
}) => {
  let dataString;
  if (!options.file) {
    const endpointUrl: string = 'https://query.wikidata.org/sparql';
    const sparqlQuery: string = `SELECT ?languageLabel ?iso_639_1 ?iso_639_2
    WHERE {
      ?language wdt:P31/wdt:P279* wd:Q34770;
                wdt:P305 ?iso_639_1;           
                wdt:P219 ?iso_639_2.       
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }`;

    const fullUrl: string =
      endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);
    const headers: { [key: string]: string } = {
      Accept: 'application/sparql-results+json',
    };

    logger.info(`Fetching: ${fullUrl}`);

    dataString = await (await fetch(fullUrl, { headers })).json();
  } else {
    if (!existsSync(options.file)) {
      logger.error("File doesn't exist");
      return;
    }

    dataString = JSON.parse(readFileSync(options.file, 'utf8'));
  }
  const data = dataString['results']['bindings'] as any[];

  logger.info('Populating languages...');

  for (const entry of data) {
    const language = await prisma.language.findFirst({
      where: {
        iso_639_2: entry.iso_639_2.value,
      },
    });

    if (language === null) {
      await prisma.language.create({
        data: {
          name: entry.languageLabel.value,
          iso_639_1: entry.iso_639_1
            ? entry.iso_639_1.value[0] + entry.iso_639_1.value[1]
            : undefined,
          iso_639_2: entry.iso_639_2.value,
        },
      });

      logger.info(
        `${entry.languageLabel.value} ${entry.iso_639_2.value} ${entry.iso_639_1 ? entry.iso_639_1.value : undefined}`
      );
    }
  }

  logger.info('Done populating languages!');
};
