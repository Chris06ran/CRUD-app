// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

// URL base de tu API de backend
//const API_URL = 'http://localhost:5000/tasks';
  const API_URL = '/api/tasks';

const App = () => {
    // Estado para guardar la lista de tareas
    const [tasks, setTasks] = useState([]);
    // Estado para guardar los datos del formulario de nueva tarea
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    // Estado para la tarea que se está editando.
    const [editingTask, setEditingTask] = useState(null);
    // Estado para almacenar el filtro actual de las tareas.
    const [filter, setFilter] = useState('all');
    // Estado para guardar el modo del tema ('light' o 'dark').
    const [theme, setTheme] = useState('light');

    // Función para obtener todas las tareas de la API
    const fetchTasks = async () => {
        try {
            let url = API_URL;
            if (filter === 'completed') {
                url = `${API_URL}?completed=true`;
            } else if (filter === 'incomplete') {
                url = `${API_URL}?completed=false`;
            }
            const response = await axios.get(url);
            setTasks(response.data);
        } catch (error) {
            console.error("Error al obtener las tareas:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, newTask);
            setTasks([response.data, ...tasks]);
            setNewTask({ title: '', description: '' });
        } catch (error) {
            console.error("Error al crear la tarea:", error);
        }
    };

    const handleUpdateTask = async (task) => {
        try {
            const updatedTaskData = { ...task, completed: !task.completed };
            const response = await axios.put(`${API_URL}/${task.id}`, updatedTaskData);
            setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
        } catch (error) {
            console.error("Error al actualizar la tarea:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`${API_URL}/${taskId}`);
            setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Error al borrar la tarea:", error);
        }
    };

    const handleEditTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_URL}/${editingTask.id}`, editingTask);
            setTasks(tasks.map((t) => (t.id === editingTask.id ? response.data : t)));
            setEditingTask(null);
        } catch (error) {
            console.error("Error al editar la tarea:", error);
        }
    };

    // Función para alternar el tema.
    // Cambia el estado `theme` de 'light' a 'dark' y viceversa.
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={`${theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gray-800 text-gray-100'} min-h-screen p-4`}>
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-extrabold mb-8 text-center">
                    Gestor de Tareas Full Stack
                </h1>

                {/* NUEVO: Botón para alternar el modo claro/oscuro.
                    - `onClick` llama a la función `toggleTheme`.
                    - El texto y el emoji cambian según el estado del tema. */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition duration-300 ease-in-out focus:outline-none"
                    >
                        {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
                    </button>
                </div>
                
                {/* Usamos el componente TaskForm para el formulario */}
                {/* Le pasamos las props necesarias para su funcionamiento */}
                <TaskForm 
                    newTask={newTask} 
                    setNewTask={setNewTask} 
                    handleCreateTask={handleCreateTask} 
                    theme={theme}
                />

                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        // MODIFICADO: Los estilos de los botones de filtro cambian con el tema.
                        className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${
                            filter === 'all' ? 'bg-blue-600 text-white' : `${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-600 text-gray-100 hover:bg-gray-500'}`
                        }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${
                            filter === 'completed' ? 'bg-blue-600 text-white' : `${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-600 text-gray-100 hover:bg-gray-500'}`
                        }`}
                    >
                        Completadas
                    </button>
                    <button
                        onClick={() => setFilter('incomplete')}
                        className={`font-bold py-2 px-4 rounded-lg transition duration-300 ${
                            filter === 'incomplete' ? 'bg-blue-600 text-white' : `${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-600 text-gray-100 hover:bg-gray-500'}`
                        }`}
                    >
                        Pendientes
                    </button>
                </div>

                {/* Usamos el componente TaskList para mostrar las tareas */}
                {/* Le pasamos todas las props necesarias para que maneje la lista y sus eventos */}
                <TaskList
                    tasks={tasks}
                    theme={theme}
                    editingTask={editingTask}
                    setEditingTask={setEditingTask}
                    handleUpdateTask={handleUpdateTask}
                    handleDeleteTask={handleDeleteTask}
                    handleEditTask={handleEditTask}
                />

            </div>
        </div>
    );
};

export default App;