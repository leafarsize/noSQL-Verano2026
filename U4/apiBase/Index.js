const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");


app.use(express.json());
const PORT = 3000;


app.use(morgan("dev"))

mongoose.connect("mongodb://127.0.0.1:27017/Escuela")
    .then(() => {
        console.log("Conectado Correctamente a MongoBB");
    })
    .catch((error) => {
        console.error("Error al conectar con MongoDB:", error);
    })
app.get("/", (req, res) => { res.send("Hola Mundo") })


app.get("/mensaje", (req, res) => {
    res.send("Mensaje dede Express")
})
app.get("/pagina", (req, res) => {
    res.send(`
        <h1>Mi Página web</h1>
        <p>Creada con Express</p>
        `)
})


app.get("/alumno", (req, res) => {
    res.json({
        nombre: "herrera",
        carrera: "ISC",
        semestre: 9
    })
})

app.get("/materias", (req, res) => {
    res.json([
        {
            nombre: "NoSQL",
            hora: "8:00-11:00"
        },
        {
            nombre: "Programación Web",
            hora: "14:00-17:00"
        }

    ])
})


app.get("/mensaje/:nombre", (req, res) => {
    res.send(`Hola ${req.params.nombre}`)
})


app.get("/suma/:a/:b", (req, res) => {

    const a = parseInt(req.params.a)
    const b = parseInt(req.params.b)
    res.send(`Resultado ${a + b}`)
})



app.get("/aleatorio", (req, res) => {
    const numero = Math.floor(Math.random() * 100) + 1
    res.send(`número generado ${numero}`)

})
app.listen(PORT, () => {
    console.log("Servidor iniciado en http://localhost:" + PORT)
})



//15 de julio 2026 
/*
let alumnos = [
    {
        id: 1,
        nombre: "Juan",
        carrera: "ISC",
        semestre: 8
    },
    {
        id: 2,
        nombre: "Armando",
        carrera: "IC",
        semestre: 3
    }

]
 */

//20 de julio del 2026
//se comento el arreglo alumnos para crear el esquema 

const alumnoSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        carrera: { type: String, required: true, trim: true },
        semestre: { type: Number, required: true, min: 1 }
    },
    {
        timestamps: true
    }
)

//usar nuestro esquema - 20 julio 2026

const Alumno = mongoose.model('Alumno', alumnoSchema, "alumnos");

//ruta para obtener todos los alumnos y mandarla al postman http://localhost:3000/alumnos


app.get("/alumnos", async (req, res) => {
    //res.json(alumnos)
    try {
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (error) {

        res.status(500).json({ mensaje: "Error al obtener alumnos", error: error });
    }
})

//obtener un alumno por su id

app.get("/alumnos/:id", async (req, res) => {

    const id =req.params.id

    const alumno = await Alumno.findById(id);
    try {
        if (!alumno) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }

        res.json(alumno);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener alumno", error: error });


    }

});


//un post 

app.post("/alumnos", async (req, res) => {
    try {
        const { nombre, carrera, semestre } = req.body
        if (!nombre || !carrera || !semestre) {
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }

        const nuevoAlumno = new Alumno({
            nombre, carrera, semestre
        });

        const alumnoGuardado = await nuevoAlumno.save();

        res.json({
            mensaje: "Alumno registrado correctamente",
            alumno: alumnoGuardado
        })

    } catch (error) {
        res.status(500).json({ mensaje: "Error al  guardar alumno", error: error });

    }
})


//modificar -> put

app.put("/alumnos/:id", async (req, res) => {
    try {
        const id =req.params.id;
        const { nombre, carrera, semestre } = req.body;

        if (!nombre || !carrera || !semestre) {
            return res.status(400).json({
                mensaje: "Faltan datos del alumno"
            });
        }

        const alumnoActualizado = await Alumno.findByIdAndUpdate(
            id,
            {
                nombre,
                carrera,
                semestre
            },
            { new: true, runValidators: true }
        );

        if (!alumnoActualizado) {
            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }

        res.json({
            mensaje: "Alumno actualizado correctamente",
            alumno: alumnoActualizado
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al  Actualizar alumno", error: error });

    }
});

//eliminar

app.delete("/alumnos/:id", async (req, res) => {
    try {
        const id = req.params.id
        const alumnoEliminado = await Alumno.findByIdAndDelete(id);
        if (!alumnoEliminado) {

            return res.status(404).json({
                mensaje: "Alumno no encontrado"
            });
        }

        res.json({
            mensaje: "Alumno eliminado correctamente",
            alumno: alumnoEliminado
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al  Eliminar alumno", error: error });

    }




})