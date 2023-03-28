function gerarTabelaVerdade(expressao) {
    //Extrai as variáveis da expressão
    const variaveis = expressao.match(/[A-Z]/g);
    const rows = Math.pow(2, variaveis.length);

    const table = [];

    for (let i = rows - 1; i >= 0; i--) {
        const row = {};
        variaveis.forEach((variavel, j) => {
            row[variavel] = Boolean(i & Math.pow(2, variaveis.length - j - 1));
            //console.log(row[variavel]);
        });
        row.result = eval(expressao.replace(/[A-Z]/g, variavel =>
            row[variavel]));
        table.push(row)
    }

    return table
}

function gerarDiagrama(expressao) {
    //cria um novo diagrama
    const diagrama = go.Diagram.fromDiv('diagramDIV');

    // define os estilos dos nós
    diagrama.nodeTemplate =
        $(go.Node, 'Auto',
            $(go.Shape, 'Ellipse', { fill: 'lightblue', strokeWidth: 0 }),
            $(go.TextBlock, new go.Binding('text', 'key'))
        );

    //define os estilos das arestas
    diagrama.linkTemplate =
        $(go.Link,
            $(go.Shape, { stroke: 'blake', strokeWidth: 2 })
        );

    //cria os nós e as arestas do diagrama a partir da expressão lógica
    const nos = {};
    const expressao1 = expressao.replace(/\s+/g, ''); //remove espaços em branco
    for (let i = 0; i < expressao1.length; i++) {
        const c = expressao1[i];
        if (/[A-Z]/.test(c)) {
            //cria um nó para cada variavel da expressao
            if (!nos[c]) {
                const key = `node${Object.keys(nos).length +1}`;
                nos[c] = { key, text: c };
                diagrama.model.addNodeData(nos[c]);
            }
        } else if (/[\(\)&\|!]/.test(c)) {
            //cria um nó para cada operador da expressao
            const key = `node${Object.keys(nos).length +1}`;
            const text = c === '!' ? 'NOT' : c;
            const node = { key, text };
            diagrama.model.addNodeData(node);
            const lastNode = diagrama.model.nodeDataArray[diagrama.model.nodeDataArray.length - 1];
            if (lastNode) {
                //cria uma aresta do último no para um novo no
                diagrama.model.addLinkData({ from: lastNode.key, to: key });
            }

        }

    }
    return diagrama;

}


const expressao = 'A & (B | C)';
//const table = gerarTabelaVerdade(expressao);
const diagrama = gerarDiagrama(expressao)

console.table(table)