// src/TaskItem.jsx
import React from 'react';

// Este componente se encarga de renderizar una sola tarea y su lógica de edición.
const TaskItem = ({ 
    task, 
    editingTask, 
    setEditingTask, 
    handleUpdateTask, 
    handleDeleteTask, 
    handleEditTask,
    theme
}) => {
    return (
        <div
            key={task.id}
            // Los estilos de la tarjeta cambian con el tema.
            className={`${theme === 'light' ? 'bg-white' : 'bg-gray-700'} p-6 rounded-lg shadow-md flex items-center justify-between transition duration-300 ${
                task.completed ? 'bg-green-100' : ''
            }`}
        >
            {editingTask && editingTask.id === task.id ? (
                // Formulario de edición que se muestra condicionalmente.
                <form onSubmit={handleEditTask} className="flex flex-col w-full gap-2">
                    <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className={`p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600 bg-gray-800 text-white'}`}
                        required
                    />
                    <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className={`p-2 border rounded-lg focus:outline-none focus:border-blue-500 ${theme === 'light' ? 'border-gray-300' : 'border-gray-600 bg-gray-800 text-white'}`}
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingTask(null)}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                // Vista normal de la tarea.
                <>
                    <div className="flex-1">
                        <h2
                            className={`text-xl font-bold ${
                                task.completed ? 'line-through text-gray-500' : `${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`
                            }`}
                        >
                            {task.title}
                        </h2>
                        <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {task.description}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setEditingTask(task)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Editar
                        </button>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleUpdateTask(task)}
                                className="form-checkbox h-5 w-5 text-green-600"
                            />
                               {/* MODIFICADO: El color del texto ahora es dinámico,
                                    si la tarea está completada se pone en verde. */}
                                    <span className={`${task.completed ? 'text-green-600' : (theme === 'light' ? 'text-gray-800' : 'text-gray-100')}`}>
                                        Completada
                                    </span>
                        </label>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Borrar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskItem;