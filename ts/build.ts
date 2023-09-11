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

import { writeFile, readFile } from 'fs/promises';
import { Command } from 'commander';

import {
  Config as SchemaConfig,
  createGenerator as schemaGenerator
} from 'ts-json-schema-generator';

import yaml from 'yaml';

import {
    CbdfABlockFile,
    CbdfAssessmentFile
  } from './schema';

const program = new Command();

program.name('build-script')
  .description('CLI para construir JSON Schemas e códigos em TypeScript');

program.command('schemas')
  .action(buildSchemas);

program.command('codes')
  .action(buildCodes);

program.parseAsync(process.argv)
  .catch(console.error);

async function buildSchema(type: string, name: string) {
  const path = 'ts/schema.ts';
  const tsconfig = 'tsconfig.json';
  const output = `cbdf-${name}-schema.json`;
  const config: SchemaConfig = { type, path, tsconfig };
  const schema = schemaGenerator(config).createSchema(type);
  const json = JSON.stringify(schema, null, 2);

  await writeFile(output, json, 'utf8');
}

async function buildSchemas() {
  await Promise.all([
    buildSchema('CbdfABlockFile', 'a-block'),
    buildSchema('CbdfAssessmentFile', 'assessment')
  ]);
}

async function buildCodes() {
  const cbdf: CbdfABlockFile = yaml.parse(await readFile('src/cbdf.yml',
    'utf8'));

  const getters = [];
  const subcodes: string[] = [];
  const codes: string[] = [];

  for (let ablockcode in cbdf) {
    const { title, type, status, assessment: include } = cbdf[ablockcode];
    const path = `src/${include.slice(7)}`;

    const assessment: CbdfAssessmentFile = yaml.parse(await readFile(path,
        'utf8'));

    getters.push([
      '',
      `      get ${ablockcode}() {`,
      '        const block = {',
      `          title: '${title}',` + (!type ? '' : ('\n' +
      `          type: '${type}',`)),
      '          get status(): CbdfABlock[\'status\'] {',
      `            return ${JSON.stringify(status)};`,
      '          },',
      '          get assessment(): CbdfAssessment[] {',
      `            return ${JSON.stringify(assessment)};`,
      '          }',
      '        };',
      '        Object.defineProperties(block, {',
      '          status: { enumerable: true },',
      '          assessment: { enumerable: true }',
      '        });',
      `        return block;`,
      '      }',
      '    '
    ].join('\n'));


    for (let statuscode in status) {
      let { qualifier } = status[statuscode];

      if (qualifier) {
        for (let qcode in qualifier) {
          subcodes.push(`${ablockcode}.${statuscode}:${qcode}`);
        }
      }
    }

    for (let btype = 1; btype <= assessment.length; btype++) {
      let { qualifier } = assessment[btype - 1];

      for (let qcode in qualifier) {
        let { subqualifier, area } = qualifier[qcode];
        let subqualobj = subqualifier || area;

        if (subqualobj) {
          for (let scode in subqualobj) {
            subcodes.push(`${ablockcode}@${btype}.${qcode}:${scode}`);
          }
        }
      }
    }

    let qualifier = assessment.map(a => Object.keys(a.qualifier));
    let tcodes = qualifier[0];

    for (let t = 1; t < qualifier.length; t++) {
      let ntcodes: string[] = [];

      for (let i = 0; i < tcodes.length; i++) {
        for (let j = 0; j < qualifier[t].length; j++) {
          ntcodes.push(`${tcodes[i]}.${qualifier[t][j]}`);
        }
      }

      tcodes = ntcodes;
    }

    for (let statuscode in status) {
      codes.push.apply(codes, tcodes.map(
        c => `${ablockcode}.${statuscode}.${c}`));
    }
  }

  const src = [
    '',
    'import { CbdfABlock, CbdfAssessment } from \'./schema\';',
    'export default {',
    '  *values() {',
    `    ${codes.map(c => `yield '${c}' as string`).join('; ')};`,
    '  },',
    '  *subvalues() {',
    `    ${subcodes.map(c => `yield '${c}' as string`).join('; ')};`,
    '  },',
    '  get map() {',
    `    return {${getters.join(`,\n`)}};`,
    '  }',
    '};',
    ''
  ].join('\n');

  await writeFile(`ts/code.ts`, src, 'utf8');
}
