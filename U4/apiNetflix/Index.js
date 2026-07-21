const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");



app.use(express.json());
const PORT = 3000;


app.use(morgan("dev"));

mongoose.connect("mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix")
    .then(() => {
        console.log("Conectado Correctamente a MongoBB");
    })
    .catch((error) => {
        console.error("Error al conectar con MongoDB:", error);
    })

app.listen(PORT, () => {
    console.log("Servidor iniciado en http://localhost:" + PORT)
})



const peliculaSchema = new mongoose.Schema(
    {

        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true, min: 1 },
        duracion: { type: Number, required: true, min: 1 },
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max: 10 },
        nc: { type: String, required: true, trim: true }

    },
    {
        timestamps: true

    }

)

const serieSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        genero: { type: String, required: true, trim: true },
        año: { type: Number, required: true, min: 1 },
        temporadas: { type: Number, required: true, min: 1 },
        episodios: { type: Number, required: true, min: 1 },
        idioma: { type: String, required: true, trim: true },
        calificacion: { type: Number, required: true, min: 0, max: 10 },
        nc: { type: String, required: true, trim: true }
    },
    {
        timestamps: true
    }
);

//ponemos en uso los esquemas 

const Pelicula = mongoose.model('Pelicula', peliculaSchema, "peliculas");

const Serie = mongoose.model('Serie', serieSchema, "series");


// GETS 

app.get("/peliculas", async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.json(peliculas);
    } catch (error) {

        res.status(500).json({ mensaje: "Error al obtener peliculas", error: error });
    }
})

app.get("/series", async (req, res) => {
    try {
        const series = await Serie.find();
        res.json(series);
    } catch (error) {

        res.status(500).json({ mensaje: "Error al obtener Series", error: error });
    }
})

//GET POR ID 

app.get("/peliculas/:id", async (req, res) => {

    const id = req.params.id

    try {
        const pelicula = await Pelicula.findById(id);

        if (!pelicula) {
            return res.status(404).json({
                mensaje: "pelicula no encontrada"
            });
        }

        res.json(pelicula);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener pelicula", error: error });


    }

});

app.get("/series/:id", async (req, res) => {

    const id = req.params.id

    try {
        const serie = await Serie.findById(id);

        if (!serie) {
            return res.status(404).json({
                mensaje: "serie no encontrada"
            });
        }

        res.json(serie);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener serie", error: error });


    }

});


//POST 




app.post("/peliculas", async (req, res) => {
    try {
        const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body
        if (!titulo || !genero || !año || !duracion || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de película"
            });
        }

        const nuevaPelicula = new Pelicula({
            titulo, genero, año, duracion, idioma, calificacion, nc
        });

        const peliculaGuardada = await nuevaPelicula.save();

        res.json({
            mensaje: "Pelicula registrada correctamente",
            pelicula: peliculaGuardada
        })

    } catch (error) {
        res.status(500).json({ mensaje: "Error al  guardar pelicula", error: error });

    }
})


app.post("/series", async (req, res) => {
    try {
        const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body
        if (!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de la serie"
            });
        }

        const nuevaSerie = new Serie({
            titulo, genero, año, temporadas, episodios, idioma, calificacion, nc
        });

        const serieGuardada = await nuevaSerie.save();

        res.json({
            mensaje: "Serie registrada correctamente",
            serie: serieGuardada
        })

    } catch (error) {
        res.status(500).json({ mensaje: "Error al  guardar Serie", error: error });

    }
})

//PUT 


app.put("/peliculas/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo, genero, año, duracion, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !duracion || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de película"
            });
        }

        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            id,
            {
                titulo, genero, año, duracion, idioma, calificacion, nc
            },
            { new: true, runValidators: true }
        );

        if (!peliculaActualizada) {
            return res.status(404).json({
                mensaje: "Pelicula no encontrada"
            });
        }

        res.json({
            mensaje: "Pelicula actualizada correctamente",
            pelicula: peliculaActualizada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al  Actualizar Pelicula", error: error });

    }
});



app.put("/series/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo, genero, año, temporadas, episodios, idioma, calificacion, nc } = req.body;

        if (!titulo || !genero || !año || !temporadas || !episodios || !idioma || !calificacion || !nc) {
            return res.status(400).json({
                mensaje: "Faltan datos de la serie"
            });
        }

        const serieActualizada = await Serie.findByIdAndUpdate(
            id,
            {
                titulo, genero, año, temporadas, episodios, idioma, calificacion, nc

            },
            { new: true, runValidators: true }
        );

        if (!serieActualizada) {
            return res.status(404).json({
                mensaje: "Serie no encontrada"
            });
        }

        res.json({
            mensaje: "Serie actualizada correctamente",
            serie: serieActualizada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al  Actualizar Serie", error: error });

    }
});

//DELETE 

app.delete("/peliculas/:id", async (req, res) => {
    try {
        const id = req.params.id
        const peliculaEliminada = await Pelicula.findByIdAndDelete(id);
        if (!peliculaEliminada) {

            return res.status(404).json({
                mensaje: "Pelicula no encontrada"
            });
        }

        res.json({
            mensaje: "Pelicula eliminada correctamente",
            pelicula: peliculaEliminada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al  Eliminar Pelicula", error: error });

    }
})

app.delete("/series/:id", async (req, res) => {
    try {
        const id = req.params.id
        const serieEliminada = await Serie.findByIdAndDelete(id);
        if (!serieEliminada) {

            return res.status(404).json({
                mensaje: "Serie no encontrada"
            });
        }

        res.json({
            mensaje: "Serie eliminado correctamente",
            serie: serieEliminada
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al  Eliminar Serie", error: error });

    }
})