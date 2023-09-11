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

import test from 'ava';

import {
  cbdfCodes,
  cbdfSubcodes,
  cbdfMap,
  cbdfTitle
} from '.';

test('cbdfCodes', (test) => {
  for (let code of cbdfCodes()) {
    test.regex(code, /^[DS]\d{2}\.\d{2}(?:\.\d)+$/);
  }
});

test('cbdfSubcodes', (test) => {
  for (let code of cbdfSubcodes()) {
    test.regex(code, /^[DS]\d{2}(?:\.\d{2}|@\d\.\d):\d+$/);
  }
});

test('cbdfMap', (test) => {
  for (let code in cbdfMap()) {
    test.regex(code, /^[DS]\d{2}$/);
  }
});

test('cbdfTitle', (test) => {
  test.is(cbdfTitle('D01.00.2.4.4.4', { 'D01@3.4': '4', 'D01@4.4': '5' }), [
    'Deficiência Cinético-funcional Neuroperiférica - Eutônica',
    'Moderada redução na função autonômica',
    'Completa redução de força',
    'Funções sensoriais alteradas - Sensação de dor aumentada',
    'Afetando um segmento ou parte do corpo - Mão esquerda'
  ].join(' | '));

  test.is(
    cbdfTitle('D04.01.0.2.8.4', {
      'D04.01': '1',
      'D04@2.2': '1',
      'D04@4.4': '0' 
    }),
    [
      [
        'Deficiência Cinético-funcional Respiratória - Obstrutiva de VAIMD',
        'Componente não secretivo'
      ].join(' - '),

      'Oxigenação normal',
      'Moderado desconforto respiratório - Esforço',
      'VEP: Não especificada',

      [
        'Completa redução de força muscular respiratória (0-4% do previsto)',
        'Inspiratória'
      ].join(' - ')
    ].join(' | ')
  );

  test.is(cbdfTitle('D06.01.2.4.1.1', { 'D06.01': '1', 'D06@4.1': '2' }), [
    [
      'Deficiência Cinético-funcional Tegumentar - Com edema agudo',
      'Sem ruptura da integridade cutânea, com alteração de pigmentação'
    ].join(' - '),

    'Moderada alteração sensorial',
    'Completa redução da mobilidade articular',
    'Leve dor',
    'Afetando coluna - Lombar'
  ].join(' | '));

  test.is(cbdfTitle('D10.00.9.9.9.1'), [
    'Deficiência Cinético-funcional Metabólica - Sem disfunção metabólica',
    'CA: Não aplicável',
    'Massa corporal: Não aplicável',
    'Gordura corporal: Não aplicável',
    'Leve alteração da massa muscular global'
  ].join(' | '));

  test.is(cbdfTitle('S03.00.0.0.0.0', { 'S03@4.0': '2' }), [
    [
      'Saúde cinético-funcional, sem alterações de estrutura e função do corpo',
      'Músculoesquelético',
      'Sem risco de deficiência cinético-funcional músculoesquelética'
    ].join(' - '),

    'Sem risco para dor',
    'Sem risco de alteração de força',
    'Sem risco de alteração de mobilidade articular',
    'Afetar cabeça - Face'
  ].join(' | '));

  test.is(cbdfTitle('S07.01.1.0.1.1', { 'S07@3.1': '0', 'S07@4.1': '1' }), [
    [
      'Saúde cinético-funcional, sem alterações de estrutura e função do corpo',
      'Urinária',
      'Com risco de deficiência cinético-funcional urinária'
    ].join(' - '),

    'Com risco de alteração das funções de bexiga',
    'Sem risco de alteração função muscular assoalho pélvico',

    [
      'Com risco de alteração funções de sensação urinária',
      'Aumento sensação enchimento bexiga'
    ].join(' - '),

    'Com risco de alteração continência urinária - Alteração de urgência'
  ].join(' | '));

  test.is(cbdfTitle('S09.00.0.1.0.0', { 'S09@2.1': '0' }), [
    [
      'Saúde cinético-funcional, sem alterações de estrutura e função do corpo',
      'Digestória',
      'Sem risco de deficiência cinético-funcional digestória'
    ].join(' - '),

    'Sem risco de alteração das funções de defecação',

    [
      'Com risco de alteração da função muscular assoalho pélvico',
      'Assoalho pélvico funcional',
      'sem dissinergia abdomino-pélvica na evacuação'
    ].join(' - '),

    'Sem risco para dor',
    'Sem risco de alteração das funções de eliminação fecal'
  ].join(' | '));

  test.is(cbdfTitle('D10.00.9.9.9.1'), [
    'Deficiência Cinético-funcional Metabólica - Sem disfunção metabólica',
    'CA: Não aplicável',
    'Massa corporal: Não aplicável',
    'Gordura corporal: Não aplicável',
    'Leve alteração da massa muscular global'
  ].join(' | '));
});
