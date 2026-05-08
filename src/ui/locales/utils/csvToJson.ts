import Papa from 'papaparse';
import translations from './translations.csv?raw';

interface TranslationRow {
  key: string;
  [lang: string]: string;
}

export default function loadCsvTranslations(): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    Papa.parse<TranslationRow>(translations, {
      download: false, // Changed to false since we're importing local file
      header: true,
      skipEmptyLines: true, // Skip empty lines
      complete: (results) => {
        try {
          const resources: any = {};
          results.data.forEach((row) => {
            if (row.key && row.key.trim()) { // Ensure key exists and is not empty
              Object.keys(row).forEach((lang) => {
                if (lang !== 'key' && row[lang]) { // Check if language column exists and has value
                  resources[lang] = resources[lang] || { };
                  resources[lang][row.key] = row[lang];
                }
              });
            }
          });

          resolve(resources);
        } catch (error: any) {
          console.error('Error processing CSV data:', error);
          reject(error);
        }
      },
      error: (error: any) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
};
