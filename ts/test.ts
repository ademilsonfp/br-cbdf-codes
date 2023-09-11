/**
 * Este arquivo é parte do programa BR-CBDF-Codes
 * 
 * BR-CBDF-Codes é um software livre; você pode redistribuí-lo e/ou
 * modificá-lo dentro dos termos da Licença Pública Geral Menor GNU como
 * publicada pela Free Software Foundation (FSF); na versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 * 
 * Este programa é distribuído na esperança de que possa ser útil,
 * mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO
 * a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a
 * Licença Pública Geral Menor GNU para maiores detalhes.
 * 
 * Você deve ter recebido uma cópia da Licença Pública Geral Menor GNU junto
 * com este programa, Se não, veja <http://www.gnu.org/licenses/lgpl-3.0.html>.
 */

import { readFile } from 'fs/promises';
import { Command } from 'commander';

import yaml from 'yaml';
import Ajv from 'ajv';

import { CbdfABlockFile } from './schema';

const program = new Command();

program.name('test-script')
  .description('CLI para testar as definições a partir do arquivo src/cbdf.yml')
  .action(test);

program.parseAsync(process.argv)
  .catch(console.error);

async function test() {
  const cbdf: CbdfABlockFile = yaml.parse(
    await readFile('src/cbdf.yml', 'utf8'));
 
  let schema = JSON.parse(await readFile('cbdf-a-block-schema.json', 'utf8'));
  const ajv = new Ajv();

  if (!ajv.validate(schema, cbdf)) {
    console.error('src/cbdf.yml');
    throw new Error(ajv.errorsText(ajv.errors));
  }

  schema = JSON.parse(await readFile('cbdf-assessment-schema.json', 'utf8'));

  for (let ablockcode in cbdf) {
    const { assessment: include } = cbdf[ablockcode];
    const path = `src/${include.slice(7)}`;
    const assessment = yaml.parse(await readFile(path, 'utf8'));
    const ajv = new Ajv();

    if (!ajv.validate(schema, assessment)) {
      console.error(path);
      throw new Error(ajv.errorsText(ajv.errors));
    }
  }
}
