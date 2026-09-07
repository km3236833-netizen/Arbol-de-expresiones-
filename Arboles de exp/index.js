const expresion = document.getElementById('expresion');
const arbol = document.getElementById('arbol');

let contador = 0;


// CREAR ARBOL
const crearArbol = (texto = "") => {

    texto = texto.replace(/\s/g, "");


    // VERIFICAR SI LOS PARENTESIS EXTERNOS ABARCAN TODO
    if (texto[0] == "(" && texto[texto.length - 1] == ")") {

        let nivel = 0;
        let completo = true;

        for (let i = 0; i < texto.length - 1; i++) {

            if (texto[i] == "(") {
                nivel++;
            }

            if (texto[i] == ")") {
                nivel--;
            }

            if (nivel == 0) {
                completo = false;
                break;
            }

        }

        if (completo) {

            texto = texto.substring(1, texto.length - 1);

        }

    }


    // BUSCAR + Y -
    let nivel = 0;

    for (let i = texto.length - 1; i >= 0; i--) {

        if (texto[i] == ")") {
            nivel++;
        }

        if (texto[i] == "(") {
            nivel--;
        }


        if (
            nivel == 0 &&
            (texto[i] == "+" || texto[i] == "-")
        ) {

            return {

                valor: texto[i],

                izquierda: crearArbol(
                    texto.substring(0, i)
                ),

                derecha: crearArbol(
                    texto.substring(i + 1)
                )

            };

        }

    }


    // BUSCAR * Y /
    nivel = 0;

    for (let i = texto.length - 1; i >= 0; i--) {

        if (texto[i] == ")") {
            nivel++;
        }

        if (texto[i] == "(") {
            nivel--;
        }


        if (
            nivel == 0 &&
            (texto[i] == "*" || texto[i] == "/")
        ) {

            return {

                valor: texto[i],

                izquierda: crearArbol(
                    texto.substring(0, i)
                ),

                derecha: crearArbol(
                    texto.substring(i + 1)
                )

            };

        }

    }


    // LETRA O NUMERO
    return {

        valor: texto,

        izquierda: null,

        derecha: null

    };

};


// DIBUJAR NODOS
const dibujarNodo = (nodo, raiz = false) => {

    if (!nodo) return "";


    contador++;

    let id = `nodo${contador}`;

    nodo.id = id;


    // DESESTRUCTURACION DEL OBJETO
    let { valor, izquierda, derecha } = nodo;


    // COLOR
    let color = "bg-success";


    if ("+-*/".includes(valor)) {

        if (raiz) {

            color = "bg-primary";

        } else {

            color = "bg-warning";

        }

    }


    // CONTENIDO
    let contenido = `

        <div class="text-center">

            <p
                id="${id}"
                class="${color} rounded-circle py-4"
                style="width:70px; margin:auto"
            >
                ${valor}
            </p>

            <div class="row justify-content-around">

    `;


    // ARREGLO DE OBJETOS
    let hijos = [
        izquierda,
        derecha
    ];


    // FOREACH
    hijos.forEach((hijo) => {

        if (hijo) {

            contenido += `

                <div class="col-5">

                    ${dibujarNodo(hijo)}

                </div>

            `;

        }

    });


    contenido += `

            </div>

        </div>

    `;


    return contenido;

};


// CONECTAR NODOS
const conectar = (nodo) => {

    if (!nodo) return;


    // DESESTRUCTURACION
    let { izquierda, derecha } = nodo;


    // ARREGLO DE OBJETOS
    let hijos = [
        izquierda,
        derecha
    ];


    // FOREACH
    hijos.forEach((hijo) => {

        if (hijo) {

            new LeaderLine(

                document.getElementById(nodo.id),

                document.getElementById(hijo.id),

                {

                    startPlug: 'disc',

                    endPlug: 'disc',

                    color: '#8b772c',

                    size: 5

                }

            );


            conectar(hijo);

        }

    });

};


// DIBUJAR ARBOL
const dibujar_arbol = (expresionInput = "") => {


    // VALIDACION
    expresionInput = expresionInput.replace(
        /[^0-9A-Za-z+\-*/()]/g,
        ""
    );


    expresion.value = expresionInput;


    // BORRAR
    arbol.innerHTML = "";


    // REINICIAR
    contador = 0;


    // SI ESTA VACIO
    if (expresionInput == "") return;


    // CREAR ARBOL
    let raiz = crearArbol(expresionInput);


    // MOSTRAR ARBOL
    arbol.innerHTML = dibujarNodo(raiz, true);


    // CONECTAR
    setTimeout(() => {

        conectar(raiz);

    }, 100);

};


// EVENTO
expresion.addEventListener('input', (event) => {

    dibujar_arbol(event.currentTarget.value);

});
