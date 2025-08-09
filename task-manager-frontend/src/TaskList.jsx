// src/TaskList.jsx
import React from 'react';
import TaskItem from './TaskItem';

// Este componente se encarga de renderizar la lista de tareas.
// Recibe la lista y las funciones de manejo como 'props'.
const TaskList = ({ tasks, theme, editingTask, setEditingTask, handleUpdateTask, handleDeleteTask, handleEditTask }) => {
    return (
        <div className="space-y-4">
            {tasks.length > 0 ? (
                // Mapea cada tarea a un componente `TaskItem`.
                tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        theme={theme}
                        editingTask={editingTask}
                        setEditingTask={setEditingTask}
                        handleUpdateTask={handleUpdateTask}
                        handleDeleteTask={handleDeleteTask}
                        handleEditTask={handleEditTask}
                    />
                ))
            ) : (
                // Mensaje cuando no hay tareas.
                <p className={`text-center text-xl mt-12 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    No hay tareas. ¡Crea una para empezar!
                </p>
            )}
        </div>
    );
};

export default TaskList;