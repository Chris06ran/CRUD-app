// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa los módulos necesarios
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Inicializa la aplicación Express
const app = express();

// Define el puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 5000;

// Middleware: Habilita CORS y el uso de JSON en las solicitudes
app.use(cors());
app.use(express.json());

// Configuración del pool de conexiones a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/* --- ENDPOINTS CRUD PARA LAS TAREAS --- */

// 1. CREAR una nueva tarea (CREATE)
app.post('/tasks', async (req, res) => {
    try {
        // Extrae el título y la descripción del cuerpo de la solicitud
        const { title, description } = req.body;
        // Valida que el título no esté vacío
        if (!title) {
            return res.status(400).json({ error: 'El título de la tarea es obligatorio' });
        }
        // Ejecuta una consulta SQL para insertar la nueva tarea y devuelve la tarea creada
        const newTask = await pool.query(
            "INSERT INTO tasks (title, description) VALUES($1, $2) RETURNING *",
            [title, description]
        );
        // Envía la nueva tarea como respuesta con un estado 201 (Creado)
        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
    }
});

// MODIFICADO: 2. GET all tasks (READ ALL)
// Esta ruta ahora puede recibir un parámetro de filtro 'completed'
app.get('/tasks', async (req, res) => {
    try {
        // Lee el valor del parámetro 'completed' desde la URL.
        const { completed } = req.query; 
        
        // Define la consulta SQL base.
        let query = "SELECT * FROM tasks";

        // NUEVO: Agrega una cláusula 'WHERE' si se detecta el parámetro 'completed'.
        if (completed === 'true') {
            query += " WHERE completed = true";
        } else if (completed === 'false') {
            query += " WHERE completed = false";
        }

        // Ordena los resultados por fecha de creación de forma descendente.
        query += " ORDER BY created_at DESC";

        // Ejecuta la consulta y envía los resultados.
        const allTasks = await pool.query(query);
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
    }
});

// 3. OBTENER una tarea por ID (READ ONE)
app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extrae el ID de los parámetros de la URL
        // Ejecuta una consulta SQL para buscar una tarea por su ID
        const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
        // Si no se encuentra la tarea, envía un error 404
        if (task.rows.length === 0) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }
        // Envía la tarea encontrada como respuesta
        res.json(task.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
    }
});

// 4. ACTUALIZAR una tarea (UPDATE)
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extrae el ID de la URL
        const { title, description, completed } = req.body; // Extrae los datos a actualizar del cuerpo
        // Ejecuta una consulta SQL para actualizar la tarea
        const updateTask = await pool.query(
            "UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *",
            [title, description, completed, id]
        );
        // Si no se encuentra la tarea, envía un error 404
        if (updateTask.rows.length === 0) {
            return res.status(404).json({ error: "Tarea no encontrada para actualizar" });
        }
        // Envía la tarea actualizada como respuesta
        res.json(updateTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
    }
});

// 5. BORRAR una tarea (DELETE)
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extrae el ID de la URL
        // Ejecuta una consulta SQL para borrar la tarea
        const deleteTask = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
        // Si no se encuentra la tarea para borrar, envía un error 404
        if (deleteTask.rows.length === 0) {
            return res.status(404).json({ error: "Tarea no encontrada para borrar" });
        }
        // Envía un mensaje de éxito como respuesta
        res.json({ message: "Tarea borrada exitosamente", task: deleteTask.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
    }
});

/* --- FIN DE ENDPOINTS --- */

// Inicia el servidor
/* app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
   });
*/
module.exports = app;