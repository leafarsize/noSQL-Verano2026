const express = require("express");
const morgan = require("morgan")
const app = express();
const PORT = 3000;


app.use(morgan("dev"))





app.get("/", (req, res) => {
    res.send(`
        <h1>Actividad 2 U4</h1>
        <p>Creada por Herrera Carvajal Ángel Rafael</p>
        <h2> ejercicios </h2>
        <ol>
        <li>Número par o impar Ruta:/par/:numero</li>
        <li>Mayor de edad Ruta: /edad/:edad</li>
        <li>Calculadora Ruta: /calculadora/:operacion/:a/:b</li>
        <li>Tabla de multiplicar Ruta: /tabla/:numero </li>
        <li>Calificacion Ruta: /calificacion/:nota</li>
        </ol>
        `)
})



//ejercicio 1. 



app.get("/par/:a", (req, res) => {

    const a = parseInt(req.params.a)


    if (a % 2 == 0) {
        res.send(`El numero ${a} es par`)
    } else {
        res.send(`El numero ${a} es impar`)

    }

})


//Ejercicio 2


app.get("/edad/:edad", (req, res) => {

    const edad = parseInt(req.params.edad);

    if (edad >= 18) {
        res.send(`Eres mayor de edad `)
    } else {
        res.send(`Eres menor de edad`)
    }


})


//Ejercicio 3  calculadora 

app.get("/calculadora/:operacion/:a/:b", (req, res) => {
    const operacion = req.params.operacion;
    let a = parseInt(req.params.a);
    let b = parseInt(req.params.b)


    switch (operacion) {
        case 'suma':
            res.send(`<h1>SUMA</h1><p>El resultado es: ${a + b}</p>`)
            break;
        case 'resta':
            res.send(`<h1>RESTA</h1><p>El resultado es: ${a - b}</p>`)



            break;
        case 'multiplicacion':
            res.send(`<h1>MULTIPLICACIÓN</h1><p>El resultado es: ${a * b}</p>`)



            break;
        case 'division':
            res.send(`<h1>DIVISIÓN</h1><p>El resultado es: ${a / b}</p>`)




        default:
            res.send(`<h1>OPERACIÓN NO ENCONTRADA</h1>`)

    }



})


//ejercicio 4 Tabla de multiplicar 

app.get("/tabla/:numero", (req, res) => {
    const numero = parseInt(req.params.numero);
    let cadena = `<h1>Tabla de multiplicar del ${numero}</h1>`;

    for (let i = 0; i <= 10; i++) {
        cadena = cadena + `${numero} x ${i} = ${numero * i}<br>`;
    }

    res.send(cadena);
});


//5 calificación 

app.get("/calificacion/:nota", (req, res) => {
    const nota = parseInt(req.params.nota);

    if (nota < 70) {
        res.send(`Reprobado`);
    } else if (nota >= 70 && nota < 80) {
        res.send(`Aprobado`)
    }
    else if (nota >= 80 && nota < 90) {
        res.send(`Muy bien `)
    }
    else
        if (nota >= 90 && nota < 100) {
            res.send(`Excelente`)
        } else {
            res.send(`introduzca una calificación de 0 a 100`)

        }





})



app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});