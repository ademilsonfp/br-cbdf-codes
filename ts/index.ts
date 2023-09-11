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

import cbdf from './code';

import {
  CbdfABlock,
  CbdfStatus,
  CbdfAssessment,
  CbdfQualifier,
  CbdfMinDef
} from './schema';

export type CbdfChapter = Omit<CbdfABlock, 'assessment'> & {
  assessment: CbdfAssessment[]
};

export type CbdfCodeTuple = [
  CbdfChapter,
  [CbdfStatus] | [CbdfStatus, CbdfMinDef],
  ([CbdfQualifier] | [CbdfQualifier, CbdfMinDef])[]
];

export function cbdfCodes() {
  return cbdf.values();
};

export function cbdfSubcodes() {
  return cbdf.subvalues();
};

export function cbdfMap() {
  return cbdf.map;
};

export function cbdfCodeTuple(code: string,
    subqualifiers = {} as Record<string, string>)
{
  const [chapterCode, statusCode, ...qualTypes] = code.split('.');

  const chapter: CbdfChapter = cbdf.map[chapterCode as keyof typeof cbdf.map];
  const status = chapter.status[statusCode];
  const { assessment } = chapter;

  const qualStruct: ([CbdfQualifier] | [CbdfQualifier, CbdfMinDef])[] = [];
  const struct: CbdfCodeTuple = [chapter, [status], qualStruct];

  const statusSubqual = subqualifiers[`${chapterCode}.${statusCode}`];

  if (statusSubqual && status.qualifier && status.qualifier[statusSubqual]) {
    struct[1].push(status.qualifier[statusSubqual]);
  }

  for (let qualIndex = 0; qualIndex < qualTypes.length; qualIndex++) {
    const { qualifier } = assessment[qualIndex];
    const { subqualifier, area } = qualifier[qualTypes[qualIndex]];
    const subqualObj = subqualifier || area || {};

    const subqual = subqualifiers[
      `${chapterCode}@${qualIndex + 1}.${qualTypes[qualIndex]}`];

    qualStruct.push([qualifier[qualTypes[qualIndex]]]);

    if (subqual && subqualObj[subqual]) {
      qualStruct[qualIndex].push(subqualObj[subqual]);
    }
  }

  return struct;
}

export function cbdfTitleTuple(code: string,
  subqualifiers?: Record<string, string>)
{
  const [chapter, statusPair, qualPairs] = cbdfCodeTuple(code, subqualifiers);

  return [
    [chapter.title, ...statusPair.map(d => d.title)],
    ...qualPairs.map(q => q.map(d => d.title))
  ] as [
    [string, string] | [string, string, string],
    ...([string] | [string, string])[]
  ];
};

export function cbdfTitle(code: string, subqualifiers?: Record<string, string>)
{
  return cbdfTitleTuple(code, subqualifiers)
    .map(group => group.join(' - '))
    .join(' | ');
};
