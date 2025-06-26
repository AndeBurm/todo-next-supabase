//Тип для задачи
export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    owner: string;
    created_at: string;
    updated_at: string;
}

//Тип для создания новой задачи (без системных полей)
export interface TodoInsert {
    title: string;
    description?: string;
    completed?: boolean;
}

//Тип для обновления задачи
export interface TodoUpdate {
    title?: string;
    description?: string;
    completed?: boolean;
}

//Тип для пользователя
export interface User {
    id: string;
    email: string;
}