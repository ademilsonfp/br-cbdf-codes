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

/**
 * @pattern ^\d$
 */
export type CbdfOneDigit = string;

/**
 * @pattern ^\d{2}$
 */
export type CbdfTwoDigit = string;

/**
 * @pattern ^\d+$
 */
export type CbdfDigits = string;

/**
 * @pattern ^[DS]\d{2}$
 */
export type CbdfCodePrefix = string;

/**
 * @pattern ^(b\d)\d{2}-\1\d{2}|b\d{3,}$
 */
export type CbdfCifCode = string;

/**
 * @pattern file://\./cbdf-[ds]\d{2}-assessment.yml
 */
export type CbdfAssessmentInclude = string;

export type CbdfMinDef = {
  title: string
};

export type CbdfStatus = CbdfMinDef & {
  qualifier?: Record<CbdfOneDigit, CbdfMinDef>
};

export type CbdfABlock = CbdfMinDef & {
  type?: string,
  status: Record<CbdfTwoDigit, CbdfStatus>,
  assessment: CbdfAssessmentInclude
};

export type CbdfABlockFile = Record<CbdfCodePrefix, CbdfABlock>;

export type CbdfQualifier = CbdfMinDef & {
  subqualifier?: Record<CbdfDigits, CbdfMinDef>,
  area?: Record<CbdfDigits, CbdfMinDef>
};

export type CbdfAssessment = CbdfMinDef & {
  cif?: CbdfCifCode[],
  note?: string,
  qualifier: Record<CbdfOneDigit, CbdfQualifier>
};

export type CbdfAssessmentFile = CbdfAssessment[];
