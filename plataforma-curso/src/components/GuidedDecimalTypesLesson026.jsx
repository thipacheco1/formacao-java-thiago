import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Search,
  Sparkles, Terminal, TriangleAlert, Variable, Wrench, Scale
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedDecimalTypesLesson.css';

const STORAGE_KEY = 'guided-decimal-types-lesson-026-progress';

const SUFFIX_TESTS = [
  { input: 'float nota = 8.5;', ok: false, desc: 'Erro: O literal 8.5 é double por padrão. Atribuir double a float exige conversão explícita ou sufixo F, caso contrário o compilador gera erro de possível perda de dados.', msg: 'incompatible types: possible lossy conversion from double to float' },
  { input: 'float nota = 8.5F;', ok: true, desc: 'Sucesso: O F maiúsculo deixa explícito para o compilador que este literal deve ser interpretado como float de 32 bits.', msg: 'Compila com sucesso.' },
  { input: 'float nota = 8.5f;', ok: true, warn: true, desc: 'Alerta: Embora compile, a letra f minúscula pode ser poluída visualmente em algumas fontes. O padrão do time prefere o F maiúsculo.', msg: 'Compila, mas prefira a convenção do F maiúsculo.' },
  { input: 'double valor = 8.5;', ok: true, desc: 'Sucesso: Literais decimais são tratados como double de 64 bits por padrão. Não há necessidade de sufixos extras.', msg: 'Compila com sucesso.' }
];

const DOMAINS_QUIZ = [
  {
    id: 0,
    title: 'Nota média de avaliação de hotel',
    options: ['double', 'BigDecimal/Centavos'],
    correct: 'double',
    reason: 'Correto! Uma média de avaliações normalmente tolera pequenas aproximações binárias. double é uma escolha simples quando o contrato não exige aritmética decimal exata.'
  },
  {
    id: 1,
    title: 'Saldo de conta bancária de cliente',
    options: ['double', 'BigDecimal/Centavos'],
    correct: 'BigDecimal/Centavos',
    reason: 'Correto! O saldo financeiro de um cliente é crítico. Somar ou subtrair usando double gerará ruídos de centavos acumulados no tempo, o que viola regras contábeis e de compliance bancário.'
  },
  {
    id: 2,
    title: 'Distância de rota de entrega de caminhão (km)',
    options: ['double', 'BigDecimal/Centavos'],
    correct: 'double',
    reason: 'Correto! Distância é uma medição e normalmente admite tolerância definida pelo domínio. double atende quando essa tolerância foi explicitada.'
  },
  {
    id: 3,
    title: 'Cálculo de imposto ICMS de nota fiscal',
    options: ['double', 'BigDecimal/Centavos'],
    correct: 'BigDecimal/Centavos',
    reason: 'Correto! Tributos, taxas legais e notas fiscais exigem precisão exata de arredondamento comercial. Erros de aproximação infinitesimal em double acarretarão divergência de centavos nas declarações fiscais.'
  },
  {
    id: 4,
    title: 'Temperatura média do processador do servidor',
    options: ['double', 'BigDecimal/Centavos'],
    correct: 'double',
    reason: 'Correto! Leituras de sensores já possuem incerteza de medição. double ou float podem servir, desde que faixa, resolução e tolerância tenham sido definidas.'
  },
  {
    id: 5,
    title: 'Cálculo de comissão de vendas de consultores',
    options: ['double', 'BigDecimal/Centavos'],
    correct: 'BigDecimal/Centavos',
    reason: 'Correto! Dinheiro real, mesmo em percentuais de comissão, exige exatidão matemática. Aproximações de double geram diferenças no fechamento do caixa da empresa.'
  }
];

const DIVISION_CASES = [
  { code: 'double resultado = 10 / 4;', type: 'Inteira', val: '2.0', desc: 'Armadilha! Ambos os operandos (10 e 4) são inteiros. O Java realiza a divisão inteira resultando em 2, e somente depois atribui esse valor ao double, gerando 2.0. Os decimais foram descartados antes do double saber da operação.' },
  { code: 'double resultado = 10.0 / 4;', type: 'Decimal (literal)', val: '2.5', desc: 'Válido! O numerador 10.0 é explicitamente decimal (double). Java promove o denominador para double e realiza a divisão decimal resultando no valor correto de 2.5.' },
  { code: 'double resultado = (double) 10 / 4;', type: 'Casting Explícito', val: '2.5', desc: 'Válido! O cast converte temporariamente o 10 em double de 64 bits antes da divisão ocorrer, fazendo com que o Java execute a divisão fracionária correta.' }
];

const PRINTF_CASES = [
  { label: 'Saída Padrão (println)', code: 'System.out.println(valor);', output: '99.9', rule: 'A saída padrão oculta o zero à direita não significativo. Não é adequada para visualizações monetárias.' },
  { label: 'Formatação 2 Casas', code: 'System.out.printf("%.2f%n", valor);', output: '99,90 em pt-BR; 99.90 em Locale.US', rule: '%.2f mostra duas casas e %n quebra a linha. O separador decimal acompanha o Locale padrão do processo.' },
  { label: 'Formatação 4 Casas', code: 'System.out.printf("%.4f%n", valor);', output: '99,9000 em pt-BR; 99.9000 em Locale.US', rule: 'A quantidade de casas é visual. O separador continua dependente do Locale.' },
  { label: 'Formatando com Símbolo de %', code: 'System.out.printf("Taxa: %.1f%%%n", valor);', output: 'Taxa: 99,9% em pt-BR', rule: '%% exibe o caractere %. O decimal pode usar vírgula ou ponto conforme o Locale.' }
];

const DOMAIN_PROGRAMS = [
  {
    label: 'Precisão decimal', file: 'PrecisaoDecimal.java',
    code: 'public class PrecisaoDecimal {\n    public static void main(String[] args) {\n        double resultado = 0.1 + 0.2;\n\n        System.out.println("Resultado: " + resultado);\n    }\n}',
    output: 'Resultado: 0.30000000000000004', insight: 'Aqui constatamos a aproximação binária dos tipos de ponto flutuante. Nunca trate saldo monetário com double de forma ingênua.'
  },
  {
    label: 'Divisão Inteira vs Decimal', file: 'DivisaoInteiraDecimal.java',
    code: 'public class DivisaoInteiraDecimal {\n    public static void main(String[] args) {\n        double resultadoInteiro = 10 / 4;\n        double resultadoDecimal = 10.0 / 4;\n\n        System.out.println("Divisão inteira: " + resultadoInteiro);\n        System.out.println("Divisão decimal: " + resultadoDecimal);\n    }\n}',
    output: 'Divisão inteira: 2.0\nDivisão decimal: 2.5', insight: 'O tipo da operação é definido pelos operandos. Dividir dois inteiros resulta em inteiro truncado, mesmo se guardado em double.'
  },
  {
    label: 'Média de pedidos', file: 'MediaPedidos.java',
    code: 'public class MediaPedidos {\n    public static void main(String[] args) {\n        int totalItens = 10;\n        int quantidadePedidos = 4;\n        double mediaItensPorPedido = (double) totalItens / quantidadePedidos;\n\n        System.out.println("Média de itens por pedido: " + mediaItensPorPedido);\n    }\n}',
    output: 'Média de itens por pedido: 2.5', insight: 'O cast explícito para (double) em um dos operandos converte a divisão em decimal.'
  },
  {
    label: 'SLA de Atendimento', file: 'SlaAtendimento.java',
    code: 'public class SlaAtendimento {\n    public static void main(String[] args) {\n        double horasPrevistas = 4.5;\n        double horasConsumidas = 2.75;\n        double horasRestantes = horasPrevistas - horasConsumidas;\n\n        System.out.println("Horas previstas: " + horasPrevistas);\n        System.out.println("Horas consumidas: " + horasConsumidas);\n        System.out.println("Horas restantes: " + horasRestantes);\n    }\n}',
    output: 'Horas previstas: 4.5\nHoras consumidas: 2.75\nHoras restantes: 1.75', insight: 'Para medições simples e SLA de horas decimais, o double atende. Caso precise de minutos precisos, opte por armazenar tudo como inteiro (minutos).'
  },
  {
    label: 'Pedido com centavos em long', file: 'PedidoCentavos.java',
    code: 'public class PedidoCentavos {\n    public static void main(String[] args) {\n        long valorProdutoCentavos = 10000L; // R$ 100,00\n        int percentualDesconto = 10;\n        long valorDescontoCentavos = valorProdutoCentavos * percentualDesconto / 100;\n        long valorFinalCentavos = valorProdutoCentavos - valorDescontoCentavos;\n\n        System.out.println("Valor produto: " + valorProdutoCentavos + " centavos");\n        System.out.println("Valor desconto: " + valorDescontoCentavos + " centavos");\n        System.out.println("Valor final: " + valorFinalCentavos + " centavos");\n    }\n}',
    output: 'Valor produto: 10000 centavos\nValor desconto: 1000 centavos\nValor final: 9000 centavos', insight: 'Armazenar moedas como inteiros em centavos (long) é uma alternativa limpa e clássica para evitar imprecisões decimais.'
  },
  {
    label: 'Cubagem e Peso', file: 'PesoCubagem.java',
    code: 'public class PesoCubagem {\n    public static void main(String[] args) {\n        double pesoKg = 12.35;\n        double volumeM3 = 0.85;\n\n        System.out.println("Peso: " + pesoKg + " kg");\n        System.out.println("Volume: " + volumeM3 + " m3");\n    }\n}',
    output: 'Peso: 12.35 kg\nVolume: 0.85 m3', insight: 'Grandezas físicas e cubagem utilizam double no código de backend sem atritos contábeis.'
  }
];

const ERRORS = [
  { title: 'Vírgula no literal', code: 'double valor = 99,90;', symptom: "';' expected", cause: 'Java adota o padrão internacional americano, utilizando o ponto (.) como separador decimal. A vírgula é interpretada como erro de sintaxe sintático.', fix: 'Mude para o ponto: 99.90.' },
  { title: 'float sem o sufixo F', code: 'float nota = 8.5;', symptom: 'possible lossy conversion from double to float', cause: 'Qualquer literal decimal sem sufixo é double de 64 bits por padrão. Colocar double em float de 32 bits pode perder dados.', fix: 'Insira o sufixo: 8.5F.' },
  { title: 'Decimal na variável int', code: 'int valor = 10.5;', symptom: 'possible lossy conversion from double to int', cause: 'Java não realiza coerção automática de fracionário para inteiro pela perda imediata da parte decimal.', fix: 'Mude o tipo da variável para double ou use cast se de fato deseja truncar o número.' },
  { title: 'Achar que double é exato', code: 'double resultado = 0.1 + 0.2;\nif (resultado == 0.3) { ... }', symptom: 'Condição falsa - não entra no bloco', cause: 'O resultado de 0.1 + 0.2 é 0.30000000000000004 por causa da conversão para dízima binária.', fix: 'Evite comparações diretas de igualdade (==) em decimais primitivos; use margens de tolerância ou opte por BigDecimal.' },
  { title: 'Moedas com double', code: 'double saldo = 1000.00;\nsaldo -= 0.10;\nsaldo -= 0.10;', symptom: 'Divergência de centavos em balanços financeiros', cause: 'Operações acumuladas com ponto flutuante geram ruídos decimais que corrompem relatórios monetários.', fix: 'Use long em centavos ou BigDecimal para cálculos monetários comerciais.' },
  { title: 'Armadilha de divisão', code: 'double media = 10 / 4;', symptom: 'Armazena 2.0 em vez de 2.5', cause: 'A divisão ocorre inteiramente entre os inteiros 10 e 4, cortando a fração antes da atribuição.', fix: 'Insira .0 em um dos literais: 10.0 / 4 ou faça cast explícito: (double) 10 / 4.' },
  { title: 'Achar printf altera valor', code: 'double valor = 99.9;\nSystem.out.printf("%.2f%n", valor);\n// valor continua 99.9 internamente', symptom: 'A saída parece arredondada, mas cálculos posteriores continuam usando o mesmo double', cause: 'printf muda apenas a representação textual, não o valor armazenado na variável.', fix: 'Trate printf como formatação de saída. Se a regra exige arredondamento, aplique uma operação e política próprias.' },
  { title: 'Decimais e aspas', code: 'double valor = "99.90";', symptom: 'incompatible types: String cannot be converted to double', cause: 'Colocar aspas transforma o número decimal em um objeto String.', fix: 'Remova as aspas: 99.90.' },
  { title: 'float por economia', code: 'float preco = 12.50F;', symptom: 'Poluição de código com sufixos e casts', cause: 'Usar float sem necessidade obriga casts em somas com double padrão.', fix: 'Adote double por padrão para decimais genéricos de medição.' },
  { title: 'Ignorar escala comercial', code: 'double imposto = 12.3456;\n// sem regras de arredondamento', symptom: 'Erros de centavos ao declarar impostos', cause: 'Ignorar o arredondamento financeiro oficial no fim da operação.', fix: 'Use classes de arredondamento apropriadas ou BigDecimal definindo a escala necessária.' }
];

const EVIDENCE = [
  '# Aula 026 — tipos decimais em Java', '',
  '## Aproximação e precisão', '- [ ] Constatei visualmente a dízima binária (0.1 + 0.2)', '- [ ] Diferenciei float (32 bits) de double (64 bits)', '- [ ] Justifiquei o double como padrão decimal genérico', '',
  '## Regras sintáticas e literais', '- [ ] Apliquei o ponto (.) e evitei vírgula no código', '- [ ] Usei o sufixo F maiúsculo para float e diferenciei do double', '- [ ] Entendi a técnica de centavos como inteiro (long)', '',
  '## Divisão e formatação', '- [ ] Identifiquei a armadilha da divisão inteira', '- [ ] Corrigi a divisão inteira com literais .0 e cast (double)', '- [ ] Formatei visualizações de console usando printf (%.2f)', '- [ ] Diferenciei formatação visual de precisão lógica interna', '',
  '## Evidências locais', '- [ ] Criei e executei os doze arquivos Java', '- [ ] Mantive os arquivos .class fora do commit Git', '',
  '## Decisão de Engenharia', '- Cenário de negócio onde manteria double:', '- Cenário de negócio onde usaria BigDecimal/Centavos:'
].join('\n');

const steps = [
  {
    id: 'tabela',
    eyebrow: 'Conceitos',
    label: 'Mapa de Anatomia',
    title: 'O que é um decimal em Java',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Decimais em Java são números fracionários. Entenda os limites em casas decimais de double (64 bits, padrão) e float (32 bits, menor).' },
      { type: 'precision_visualizer' }
    ]
  },
  {
    id: 'aproximacao',
    eyebrow: 'Simulação',
    label: 'Balança Binária',
    title: 'Aproximação de dízimas na Base 2',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Por que 0.1 + 0.2 dá 0.30000000000000004? Computadores usam binário, aproximando certas frações infinitas. Use a balança interativa abaixo para ver o desequilíbrio na prática.' },
      { type: 'binary_scale' }
    ]
  },
  {
    id: 'sufixo',
    eyebrow: 'Sintaxe',
    label: 'Sufixo F e float',
    title: 'Literais e a regra do F maiúsculo',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Literais fracionários são double por padrão. Para float, você DEVE declarar o sufixo F. Teste o compilador interativo abaixo.' },
      { type: 'suffix_simulator' }
    ]
  },
  {
    id: 'dominios',
    eyebrow: 'Engenharia de Software',
    label: 'Balança de Domínios',
    title: 'Tolerante vs Crítico: Dinheiro não é double',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Cálculos contábeis exigem regras decimais e arredondamento explícitos. Medições trabalham com tolerâncias. Classifique cada cenário pelo contrato, não por uma regra automática.' },
      { type: 'domains_sorter' },
      { type: 'note', tone: 'warning', title: 'Dinheiro em Sistemas Reais', text: 'Para dinheiro, utilize BigDecimal ou guarde em centavos usando long. Nunca faça contas de dinheiro reais com double.' }
    ]
  },
  {
    id: 'divisao',
    eyebrow: 'Armadilha',
    label: 'Divisão de Inteiros',
    title: 'Truncamento de decimais no compilador',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'O compilador escolhe o tipo da operação pelos operandos, não pela variável que recebe. Se os dois lados são inteiros, os decimais são cortados antes de chegar no double!' },
      { type: 'division_lab' }
    ]
  },
  {
    id: 'printf',
    eyebrow: 'Apresentação',
    label: 'printf e Exibição',
    title: 'Formatando a saída sem alterar os dados',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Modifique a lente de exibição no console usando System.out.printf e o especificador %.2f. A formatação não altera a variável, e o separador decimal depende do Locale.' },
      { type: 'printf_visualizer' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Práticos',
    title: 'Galeria de programas aplicados',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Consulte a galeria de códigos para explorar diferentes domínios e a alternativa de modelagem de moedas em centavos.' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Análise de falhas clássicas de ponto flutuante',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Examine os sintomas do javac, as causas e as correções dos 10 erros mais comuns ao trabalhar com decimais.' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Prática',
    label: 'Entrega do Lab',
    title: 'Compilando os doze códigos e audição do Git',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Estruture, compile e execute o laboratório localmente na pasta labs/m1/aula-026-tipos-decimais. Crie um commit limpo mantendo a higiene do repositório.' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Frete e Cubagem',
        text: 'Crie o arquivo FreteLogisticoDecimal.java em labs/m1/aula-026-tipos-decimais/. Modele uma carga com ID (long), peso em kg (double), volume (double), valor base do frete em centavos (long) e taxa percentual de distância (double). Calcule o valor decimal ajustado e converta para centavos com Math.round, deixando explícita essa política. Exiba os dados com println e printf e compare o separador do Locale atual.',
        acceptance: [
          'ID da carga modelado como long.',
          'Grandezas físicas (peso/volume) e taxa de distância modeladas como double.',
          'Valores monetários calculados e guardados como long em centavos, com Math.round explícito na conversão.',
          'O programa deve compilar sem avisos e rodar exibindo saídas formatadas com printf.',
          'Higiene Git: commit com histórico limpo de arquivos compilados .class.'
        ]
      }
    ]
  }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="dec26-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file dec26-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function BinaryScaleLab() {
  const [weightLeft, setWeightLeft] = useState(0);
  
  const displayVal = useMemo(() => {
    if (weightLeft === 0) return '0.00000000000000000';
    if (weightLeft === 1) return '0.10000000000000000';
    if (weightLeft === 2) return '0.20000000000000000';
    // O estouro clássico
    return '0.30000000000000004';
  }, [weightLeft]);

  const rotation = useMemo(() => {
    if (weightLeft === 0) return 0;
    if (weightLeft === 1) return -2;
    if (weightLeft === 2) return 2;
    // Desequilíbrio pelo ruído decimal infinitesimal
    return 1.5;
  }, [weightLeft]);

  return <section className="dec26-scale-container">
    <div>
      <h3>Balança de Ponto Flutuante Binário</h3>
      <p style={{ fontSize: '.76rem', color: '#047857', lineHeight: 1.5 }}>
        Adicione os pesos no prato esquerdo da balança. O prato direito contém o peso de referência exato de 0.3. Veja a dízima binária em ação no visor!
      </p>
      <div style={{ display: 'flex', gap: '8px', margin: '14px 0' }}>
        <button type="button" onClick={() => setWeightLeft(prev => prev === 1 || prev === 3 ? prev - 1 : prev + 1)} style={{ padding: '8px 12px', background: weightLeft === 1 || weightLeft === 3 ? '#b91c1c' : '#059669', color: '#fff', border: 0, borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>
          {weightLeft === 1 || weightLeft === 3 ? 'Remover Peso 0.1' : 'Colocar Peso 0.1'}
        </button>
        <button type="button" onClick={() => setWeightLeft(prev => prev === 2 || prev === 3 ? prev - 2 : prev + 2)} style={{ padding: '8px 12px', background: weightLeft === 2 || weightLeft === 3 ? '#b91c1c' : '#059669', color: '#fff', border: 0, borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>
          {weightLeft === 2 || weightLeft === 3 ? 'Remover Peso 0.2' : 'Colocar Peso 0.2'}
        </button>
        <button type="button" onClick={() => setWeightLeft(0)} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}><RotateCcw size={14} /></button>
      </div>
      <div className="dec26-scale-display" aria-label={`Visor da balança: ${displayVal} kg`}>
        {displayVal} kg
      </div>
    </div>
    <div className="dec26-scale-visual">
      <div className="dec26-scale-beam" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Prato Esquerdo */}
        <div className="dec26-scale-pan left">
          <div style={{ height: '24px', width: '2px', background: '#718096' }} />
          {weightLeft === 1 && <div className="dec26-scale-weight">0.1</div>}
          {weightLeft === 2 && <div className="dec26-scale-weight">0.2</div>}
          {weightLeft === 3 && (
            <>
              <div className="dec26-scale-weight">0.1</div>
              <div className="dec26-scale-weight">0.2</div>
            </>
          )}
          <div className="dec26-scale-dish" />
        </div>
        {/* Prato Direito */}
        <div className="dec26-scale-pan right">
          <div style={{ height: '24px', width: '2px', background: '#718096' }} />
          <div className="dec26-scale-weight" style={{ background: '#0284c7' }}>0.3</div>
          <div className="dec26-scale-dish" />
        </div>
      </div>
      <div style={{ width: '0', height: '0', borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '24px solid #718096', marginTop: '38px' }} />
      <span style={{ fontSize: '.6rem', color: '#64748b', marginTop: '4px', fontWeight: 'bold' }}>
        {weightLeft === 3 ? 'Balança desequilibrada por ruído infinitesimal!' : weightLeft === 0 ? 'Balança vazia e zerada.' : 'Balança pendendo para o peso ativo.'}
      </span>
    </div>
  </section>;
}

function PrecisionSelectorLab() {
  const [numVal, setNumVal] = useState('1.234567890123456789');

  const floatVal = useMemo(() => {
    const val = Number(numVal);
    // Aproxima o valor com a mesma largura binária de um float Java.
    if (numVal.trim() === '' || !Number.isFinite(val)) return 'Inválido';
    return Math.fround(val).toString();
  }, [numVal]);

  const doubleVal = useMemo(() => {
    const val = Number(numVal);
    // JavaScript Number e Java double seguem IEEE 754 binary64.
    if (numVal.trim() === '' || !Number.isFinite(val)) return 'Inválido';
    return val.toString();
  }, [numVal]);

  return <section className="dec26-precision-container">
    <div className="dec26-precision-input">
      <label htmlFor="dec26-number-input">Insira um número longo:</label>
      <input
        id="dec26-number-input"
        type="text"
        value={numVal}
        onChange={e => setNumVal(e.target.value.replace(/[^0-9.]/g, ''))}
      />
    </div>
    <div className="dec26-precision-compare">
      <div className="dec26-precision-card float">
        <header>
          <span>float (32 bits)</span>
          <strong style={{ color: '#059669' }}>~7 dígitos significativos</strong>
        </header>
        <strong>{floatVal}</strong>
        <p>Arredonda e perde precisão mais cedo devido ao limite menor de bits.</p>
      </div>
      <div className="dec26-precision-card double">
        <header>
          <span>double (64 bits)</span>
          <strong style={{ color: '#06b6d4' }}>~15–16 dígitos significativos</strong>
        </header>
        <strong>{doubleVal}</strong>
        <p>Mantém maior precisão. É o tipo padrão de literais decimais no Java.</p>
      </div>
    </div>
  </section>;
}

function SuffixFPlayground() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const item = SUFFIX_TESTS[selectedIdx];
  return <section className="dec26-suffix-simulator">
    <div className="dec26-suffix-box">
      <div className="dec26-quiz-options">
        {SUFFIX_TESTS.map((test, index) => (
          <button type="button" className={selectedIdx === index ? 'active' : ''} onClick={() => setSelectedIdx(index)} key={index}>
            <code>{test.input}</code>
            {test.ok ? (test.warn ? <TriangleAlert size={16} style={{ color: '#eab308' }} /> : <Check size={16} style={{ color: '#10b981' }} />) : <TriangleAlert size={16} style={{ color: '#ef4444' }} />}
          </button>
        ))}
      </div>
      <div className={`dec26-compilation-result ${item.ok && !item.warn ? 'success' : 'error'}`}>
        <strong>{item.ok ? (item.warn ? 'Status: Advertência de leitura' : 'Status: Compilação realizada') : 'Status: Falha de compilação'}</strong>
        <p style={{ margin: '4px 0', fontSize: '.72rem' }}>{item.desc}</p>
        {!item.ok && <pre>Main.java:3: error: {item.msg}</pre>}
        {item.warn && <pre>Checkstyle: Evite 'f' minúsculo. Adote 'F' maiúsculo.</pre>}
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px' }}>
        <Lightbulb size={22} />
        <div>
          <strong>Sufixo Decimal Pragmático</strong>
          <p>
            Em Java, decimais sem sufixo são avaliados automaticamente como double. O float, por ter metade do tamanho, impede a atribuição sem o F para proteger a integridade numérica.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function DomainsSorterLab() {
  const [selected, setSelected] = useState(0);
  const quiz = DOMAINS_QUIZ[selected];
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  return <section className="dec26-domains-sorter">
    <div className="dec26-sorter-options">
      {DOMAINS_QUIZ.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => { setSelected(index); setSelectedAnswer(null); }} key={entry.id}>
          <div>
            <strong>{entry.title}</strong>
            <span>Cenário de negócio {index + 1}</span>
          </div>
        </button>
      ))}
    </div>
    <div className="dec26-sorter-feedback">
      <div>
        <h3 style={{ fontFamily: 'inherit', fontWeight: 'bold', color: '#0f291e' }}>{quiz.title}</h3>
        <p style={{ fontSize: '.72rem', color: '#334155', margin: '6px 0 12px' }}>Qual é o tipo decimal mais adequado profissionalmente para este caso?</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {quiz.options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedAnswer(option)}
              style={{
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '.72rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: selectedAnswer === option ? (option === quiz.correct ? '#10b981' : '#ef4444') : '#fff',
                color: selectedAnswer === option ? '#fff' : '#475569',
                borderColor: selectedAnswer === option ? (option === quiz.correct ? '#10b981' : '#ef4444') : '#cbd5e1'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {selectedAnswer && (
        <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '12px' }}>
          <span className={`dec26-sorter-badge ${selectedAnswer === quiz.correct ? 'tolerant' : 'critical'}`} style={{ marginBottom: '6px' }}>
            {selectedAnswer === quiz.correct ? 'Decisão Profissional Correta' : 'Alerta de Risco Contábil'}
          </span>
          <p style={{ fontSize: '.72rem', lineHeight: 1.5, margin: '4px 0 0', color: selectedAnswer === quiz.correct ? '#065f46' : '#991b1b' }}>
            {selectedAnswer === quiz.correct ? quiz.reason : 'Atenção: Usar double para saldo ou impostos acarretará erros cumulativos e insolvência nos cálculos do sistema! Prefira BigDecimal ou armazene em centavos via long.'}
          </p>
        </div>
      )}
    </div>
  </section>;
}

function DivisionLab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const item = DIVISION_CASES[selectedIdx];
  return <section className="dec26-division-lab">
    <div className="dec26-division-panel">
      <div className="dec26-quiz-options">
        {DIVISION_CASES.map((entry, index) => (
          <button type="button" className={selectedIdx === index ? 'active' : ''} onClick={() => setSelectedIdx(index)} key={index}>
            <code>{entry.code}</code>
            <span className="dec26-sorter-badge tolerant" style={{ background: entry.type === 'Inteira' ? '#fee2e2' : '#d1fae5', color: entry.type === 'Inteira' ? '#991b1b' : '#065f46', border: 0 }}>{entry.type}</span>
          </button>
        ))}
      </div>
      <div className="dec26-fraction-display">
        {selectedIdx === 0 && (
          <>
            <div className="dec26-fraction-num-den">
              <span>10</span>
              <div className="dec26-fraction-line" />
              <span>4</span>
            </div>
            <span>=</span>
            <div style={{ color: '#ef4444', fontWeight: 'bold' }}>2</div>
            <span style={{ fontSize: '.7rem', color: '#94a3b8' }}>(trunca decimal)</span>
            <span>→</span>
            <div style={{ color: '#ef4444' }}>2.0</div>
          </>
        )}
        {selectedIdx === 1 && (
          <>
            <div className="dec26-fraction-num-den">
              <span>10.0</span>
              <div className="dec26-fraction-line" />
              <span>4</span>
            </div>
            <span>=</span>
            <div style={{ color: '#10b981', fontWeight: 'bold' }}>2.5</div>
          </>
        )}
        {selectedIdx === 2 && (
          <>
            <div className="dec26-fraction-num-den">
              <span>(double) 10</span>
              <div className="dec26-fraction-line" />
              <span>4</span>
            </div>
            <span>=</span>
            <div style={{ color: '#10b981', fontWeight: 'bold' }}>2.5</div>
          </>
        )}
      </div>
      <div className={`dec26-division-result ${selectedIdx === 0 ? 'warn' : ''}`}>
        <strong>Explicação:</strong>
        <p style={{ margin: '4px 0 0', fontSize: '.72rem', lineHeight: 1.5, color: 'inherit' }}>{item.desc}</p>
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px' }}>
        <Lightbulb size={22} />
        <div>
          <strong>Promoção de Operando</strong>
          <p>
            Se pelo menos um dos operandos da divisão for ponto flutuante (literal .0 ou cast explícito), o compilador do Java promove a operação inteira para fracionária automaticamente.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function PrintfVisualizerLab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const item = PRINTF_CASES[selectedIdx];
  return <section className="dec26-printf-visualizer">
    <div className="dec26-printf-box">
      <div className="dec26-printf-controls">
        <label style={{ fontSize: '.75rem', color: '#0f766e', fontWeight: 'bold' }}>Escolha a instrução de saída:</label>
        <div className="dec26-printf-nav">
          {PRINTF_CASES.map((entry, index) => (
            <button key={index} type="button" className={selectedIdx === index ? 'active' : ''} onClick={() => setSelectedIdx(index)}>
              {entry.label}
            </button>
          ))}
        </div>
        <div className="dec26-printf-preview">
          <span>Código Java executado:</span>
          <code>{item.code}</code>
        </div>
        <p style={{ margin: '0', fontSize: '.75rem', lineHeight: 1.5, color: '#0d9488' }}>{item.rule}</p>
      </div>
      <div className="int25-console">
        <header><Terminal size={15} /> Console do Java</header>
        <pre>{item.output}</pre>
        <div style={{ padding: '8px 12px', background: '#1e293b', color: '#94a3b8', fontSize: '.64rem', borderTop: '1px solid #334155', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Sparkles size={14} style={{ color: '#06b6d4' }} />
          <span>Valor lógico interno da variável: <strong>99.9</strong> (inalterado)</span>
        </div>
      </div>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="dec26-domains-gallery">
    <div className="dec26-domains-sidebar">
      {DOMAIN_PROGRAMS.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.file}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="dec26-domains-content">
      <CodePanel name={item.file} code={item.code} />
      <section className="dec26-console">
        <header><Terminal size={15} /> Console de saída esperado</header>
        <pre>{item.output}</pre>
        <p style={{ display: 'flex', gap: '8px', margin: '0', padding: '12px 14px', alignItems: 'flex-start', color: '#94a3b8', background: '#1e293b', borderTop: '1px solid #334155', fontSize: '.72rem', lineHeight: 1.5 }}>
          <Sparkles size={16} style={{ color: '#10b981', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="dec26-errors-clinic">
    <nav className="dec26-errors-nav">
      {ERRORS.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.title}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="dec26-error-card">
      <header>
        <AlertTriangle size={20} />
        <div>
          <small>Caso {selected + 1} de {ERRORS.length}</small>
          <h3>{item.title}</h3>
        </div>
      </header>
      <CodePanel name="Código Incorreto" code={item.code} />
      <section style={{ margin: '12px 0' }}>
        <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma ou Mensagem</small>
        <code>{item.symptom}</code>
      </section>
      <div className="dec26-error-flow">
        <span>
          <Search size={16} />
          <div>
            <strong>Causa</strong>
            <p>{item.cause}</p>
          </div>
        </span>
        <ChevronRight size={18} />
        <span>
          <Wrench size={16} />
          <div>
            <strong>Correção</strong>
            <p>{item.fix}</p>
          </div>
        </span>
      </div>
    </div>
  </section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Estruturar Diretório',
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-026-tipos-decimais\ncd labs\\m1\\aula-026-tipos-decimais\nNew-Item Main.java, FloatDouble.java, PrecisaoDecimal.java, DivisaoInteiraDecimal.java, MediaPedidos.java, DistanciaEntrega.java, MediaAvaliacao.java, PercentualConclusao.java, PedidoDecimal.java, PedidoCentavos.java, SlaAtendimento.java, PesoCubagem.java',
      out: 'Doze arquivos Java criados na estrutura do repositório.',
      tip: 'Abra cada arquivo no IntelliJ e copie os respectivos códigos de negócio, analisando as escolhas semânticas de double, float e long centavos.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac Main.java FloatDouble.java PrecisaoDecimal.java DivisaoInteiraDecimal.java MediaPedidos.java DistanciaEntrega.java MediaAvaliacao.java PercentualConclusao.java PedidoDecimal.java PedidoCentavos.java SlaAtendimento.java PesoCubagem.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há mensagens de erro de compilação (possibles lossy conversions ou tokens errados).'
    },
    {
      title: 'Executar Programas',
      cmd: 'java Main\njava PrecisaoDecimal\njava DivisaoInteiraDecimal',
      out: 'Saída exibindo a dízima 0.30000000000000004 e as divisões comparadas.',
      tip: 'Verifique com atenção os arredondamentos silenciosos e reflita sobre os riscos de usar double em dinheiro.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-026-tipos-decimais docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 026: pratica tipos decimais e limitacoes em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Certifique-se de que os arquivos .class não entraram no commit, garantindo a higiene do seu histórico de modificações.'
    }
  ];

  const current = steps[stage];

  return <section className="dec26-terminal-flow">
    <div className="dec26-delivery-flow">
      <nav>
        {steps.map((entry, index) => (
          <button type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)} key={entry.title}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="dec26-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="dec26-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file dec26-evidence" style={{ marginTop: '14px' }}>
      <div className="guided-file-title">
        <BookOpenCheck size={16} /> docs/diario-de-bordo.md
        <CopyButton value={EVIDENCE} label="Copiar evidências" />
      </div>
      <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>
        {EVIDENCE}
      </SyntaxHighlighter>
    </div>
  </section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'binary_scale') return <BinaryScaleLab />;
  if (block.type === 'precision_visualizer') return <PrecisionSelectorLab />;
  if (block.type === 'suffix_simulator') return <SuffixFPlayground />;
  if (block.type === 'domains_sorter') return <DomainsSorterLab />;
  if (block.type === 'division_lab') return <DivisionLab />;
  if (block.type === 'printf_visualizer') return <PrintfVisualizerLab />;
  if (block.type === 'domains_gallery') return <DomainsGalleryLab />;
  if (block.type === 'errors_clinic') return <ErrorsClinicLab />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}>
      <Icon size={21} />
      <div>
        <strong>{block.title}</strong>
        <p>{block.text}</p>
      </div>
    </aside>;
  }
  if (block.type === 'challenge') {
    return <section className="guided-challenge">
      <div className="guided-challenge-title">
        <Sparkles size={22} />
        <h3>{block.title}</h3>
      </div>
      <p>{block.text}</p>
      <h4>Critérios de aceite</h4>
      <ul>
        {block.acceptance.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </section>;
  }
  return null;
}

export default function GuidedDecimalTypesLesson026({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = `${completedStepIds.size} de ${steps.length} etapas concluídas`;

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleActiveStep = () => {
    if (activeStepComplete && isCompleted) onToggleCompleted();
    setCompletedStepIds(previous => {
      const next = new Set(previous);
      if (next.has(activeStep.id)) {
        next.delete(activeStep.id);
      } else {
        next.add(activeStep.id);
      }
      return next;
    });
  };

  return <article className="guided-git-lesson guided-decimal-types-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Oficina de tipos decimais</span>
        <p className="guided-sequence">026 · M1.06</p>
        <h1>Tipos Decimais e Primeiras Limitações Físicas</h1>
        <p>Aprenda a lidar com double, float e aproximações binárias, use o sufixo F, desvende a armadilha da divisão de inteiros e formate o console com printf.</p>
      </div>
      <div className="guided-hero-status">
        <Scale size={42} />
        <strong>{progress}%</strong>
        <span>{completedLabel}</span>
      </div>
      <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </header>

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'float/double', label: 'tipos primitivos' }, { value: '64 bits', label: 'tamanho máximo' }, { value: '10 casos', label: 'clínica de erros' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 026">
        <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
        {steps.map((step, index) => (
          <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}>
            <span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
            <span>
              <strong>{step.label}</strong>
              <small>{step.duration}</small>
            </span>
          </button>
        ))}
      </nav>

      <main className="guided-step-content">
        <div className="guided-step-heading">
          <span>{activeStep.eyebrow} · {activeStep.duration}</span>
          <h2>{activeStep.title}</h2>
        </div>
        <div className="guided-blocks">
          {activeStep.blocks.map((block, index) => (
            <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />
          ))}
        </div>

        <div className="guided-step-actions">
          <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
          <div className="guided-step-actions-main">
            <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>
              {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}
            </button>
            {activeIndex < steps.length - 1 && (
              <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>
            )}
          </div>
        </div>

        {allStepsComplete && (
          <section className="guided-finish">
            <CheckCircle2 size={30} />
            <div>
              <h3>{lessonComplete ? 'Decimais e limitações dominados!' : 'Oficina concluída'}</h3>
              <p>{lessonComplete ? 'Etapas, evidências e conclusão registradas no repositório.' : 'Conclua a aula para consolidar seus conhecimentos e liberar a próxima etapa.'}</p>
            </div>
            <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
              {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
            </button>
          </section>
        )}
      </main>
    </div>

    <footer className="guided-course-nav">
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 025</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Decimais com discernimento profissional' : allStepsComplete ? 'Use o botão acima' : 'Estude as dízimas binárias e sufixos'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir booleanos'}>Aula 027 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
