// src/TaskForm.jsx
import React from 'react';

// Este componente maneja el formulario para crear nuevas tareas.
const TaskForm = ({ newTask, setNewTask, handleCreateTask, theme }) => {
    return (
        // Se aplican estilos dinámicos según el tema actual.
        <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-700'} p-6 rounded-lg shadow-xl mb-8`}>
            {/* El formulario envía los datos a la función `handleCreateTask` */}
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Título de la tarea"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    // Los estilos del input cambian con el tema.
                    className={`p-3 border rounded-lg focus:outline-none focus:border-blue-500 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600 bg-gray-800 text-white'}`}
                    required
                />
                <textarea
                    placeholder="Descripción (opcional)"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    // Los estilos del textarea cambian con el tema.
                    className={`p-3 border rounded-lg focus:outline-none focus:border-blue-500 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600 bg-gray-800 text-white'}`}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                    Crear Tarea
                </button>
            </form>
        </div>
    );
};

export default TaskForm;