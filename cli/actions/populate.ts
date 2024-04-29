import prisma from '../../server/db';

export const populate = async () => {
  class SPARQLQueryDispatcher {
    private endpoint: string;

    constructor(endpoint: string) {
      this.endpoint = endpoint;
    }

    query(sparqlQuery: string): Promise<any> {
      const fullUrl: string =
        this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
      const headers: { [key: string]: string } = {
        Accept: 'application/sparql-results+json',
      };

      return fetch(fullUrl, { headers }).then((body: Response) => body.json());
    }
  }

  const endpointUrl: string = 'https://query.wikidata.org/sparql';
  const sparqlQuery: string = `SELECT ?countryLabel ?iso_code ?languageCode ?languageLabel
      WHERE 
      {
        ?country wdt:P297 ?iso_code .
        ?country wdt:P37 ?language.
        ?language wdt:P424 ?languageCode.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }`;

  const queryDispatcher: SPARQLQueryDispatcher = new SPARQLQueryDispatcher(
    endpointUrl
  );

  queryDispatcher.query(sparqlQuery).then(async (dataString: any) => {
    const data = dataString['results']['bindings'] as any[];

    console.log('Populating countries and languages...');

    for (const entry of data) {
      const language = await prisma.language.findFirst({
        where: {
          iso_639_1: entry.languageCode.value,
        },
      });

      if (language === null) {
        await prisma.language.create({
          data: {
            name: entry.languageLabel.value,
            iso_639_1: entry.languageCode.value,
          },
        });

        console.log(`${entry.languageLabel.value} ${entry.languageCode.value}`);
      }

      const country = await prisma.country.findFirst({
        where: {
          iso_3166_1: entry.iso_code.value,
        },
      });

      if (country === null) {
        await prisma.country.create({
          data: {
            name: entry.countryLabel.value,
            iso_3166_1: entry.iso_code.value,
          },
        });

        console.log(`${entry.countryLabel.value} ${entry.iso_code.value}`);
      }
    }
  });

  console.log('Done populating countries and languages!');
};
