# BR-CBDF-Codes

Códigos da CBDF (COFFITO) em formato reutilizável (YAML)

Referência: [RESOLUÇÃO Nº 555, DE 28 DE MARÇO DE 2022 &mdash; Institui a Classificação Brasileira de Diagnósticos Fisioterapêuticos &ndash; CBDF e dá outras providências]

Além das definições da CBDF, este projeto contém também um módulo para Node.js.

## Utilização (Node.js)

Esse módulo pode ser obtido via NPM:

```bash
npm i br-cbdf-codes
```

Conteúdo do módulo:

- `function *cbdfCodes(): Generator<string, void, unknown>` &mdash; gerador de
  códigos válidos da CBDF;

- `function *cbdfSubcodes(): Generator<string, void, unknown>` &mdash; gerador
  de subcódigos da CBDF, em formato sugerido por esta biblioteca;

- `function cbdfMap(): { readonly D01: CbdfChapter, readonly D02: ... }` &mdash;
  obtém definição estruturada dos códigos da CBDF;

- `function cbdfCodeTuple(code: string, subqualifiers?: Record<string, string>): CbdfCodeTuple`
  &mdash; obtém definições de partes de código da CBDF em tupla ordenada;

- `function cbdfTitleTuple(code: string, subqualifiers?: Record<string, string>): string[][]`
  &mdash; obtém títulos de partes de código da CBDF em tupla ordenada para
  formatação final; e

- `function cbdfTitle(code: string, subqualifiers?: Record<string, string>): string`
  &mdash; obtém título completo de código da CBDF no formato padrão.

### Exemplo

Obtendo título completo de código da CBDF no formato padrão.

```ts
import { cbdfTitle } from 'br-cbdf-codes';

cbdfTitle('D04.01.0.2.8.4', {
  'D04.01': '1',   // especificando qualificador de status D04.01

  'D04@2.2': '1',  // especificando subqualificador para o qualificador de tipo
                   // D04@2.2

  'D04@4.4': '0'   // especificando subqualificador para o qualificador de tipo
                   // D04@4.4
});

/*
Deficiência Cinético-funcional Respiratória - Obstrutiva de VAIMD - Componente
não secretivo | Oxigenação normal | Moderado desconforto respiratório -
Esforço | VEP: Não especificada | Completa redução de força muscular
respiratória (0-4% do previsto) - Inspiratória
*/
```

Exibindo todos os códigos CBDF disponíveis neste projeto:

```ts
import { cbdfCodes } from 'br-cbdf-codes';

for (let code of cbdfCodes()) {
  console.log(code);
}

// D01.00.0.0.0.0
// D01.00.0.0.0.1
// D01.00.0.0.0.2
// ...
// S10.01.1.1.1.1
```

Exibindo todos os subcódigos CBDF disponíveis neste projeto, em formato
sugerido:

```ts
import { cbdfSubcodes } from 'br-cbdf-codes';

for (let subcode of cbdfSubcodes()) {
  console.log(subcode);
}

// D01@3.4:0
// D01@3.4:1
// D01@3.4:2
// ...
// D04.00:0
// ...
// S10@1.1:2
```

## Licença

Este arquivo é parte do programa BR-CBDF-Codes

BR-CBDF-Codes é um software livre; você pode redistribuí-lo e/ou
modificá-lo dentro dos termos da Licença Pública Geral Menor GNU como
publicada pela Free Software Foundation (FSF); na versão 3 da
Licença, ou (a seu critério) qualquer versão posterior.

Este programa é distribuído na esperança de que possa ser útil,
mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO
a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a
Licença Pública Geral Menor GNU para maiores detalhes.

Você deve ter recebido uma cópia da Licença Pública Geral Menor GNU junto
com este programa, Se não, veja <http://www.gnu.org/licenses/lgpl-3.0.html>.

[RESOLUÇÃO Nº 555, DE 28 DE MARÇO DE 2022 &mdash; Institui a Classificação Brasileira de Diagnósticos Fisioterapêuticos &ndash; CBDF e dá outras providências]: https://www.coffito.gov.br/nsite/?p=21882
