'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Todo, TodoInsert, TodoUpdate } from '@/lib/types';
import AuthGuard from '@/components/AuthGuard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function TodosPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [editingTodo, setEditingTodo] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);

    // Загружаем пользователя и задачи при загрузке страницы
    useEffect(() => {
        getUser();
        fetchTodos();
    }, []);

    // Получаем информацию о текущем пользователе
    const getUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
    };

    // Загружаем все задачи пользователя
    const fetchTodos = async () => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Ошибка загрузки задач:', error);
                return;
            }

            setTodos(data || []);
        } catch (error) {
            console.error('Ошибка:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Создаем новую задачу
    const createTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!newTodoTitle.trim()) {
            setFormError('Введите название задачи');
            return;
        }
        if (!user?.id) {
            setFormError('Ошибка: пользователь не найден');
            return;
        }

        try {
            // Добавляем owner (id пользователя) при создании задачи
            const newTodo: TodoInsert & { owner: string } = {
                title: newTodoTitle.trim(),
                description: newTodoDescription.trim() || undefined,
                completed: false,
                owner: user.id,
            };

            const { data, error } = await supabase
                .from('todos')
                .insert(newTodo)
                .select()
                .single();

            if (error) {
                console.error('Ошибка создания задачи:', error);
                alert('Ошибка создания задачи');
                return;
            }

            // Добавляем новую задачу в начало списка
            setTodos([data, ...todos]);
            setNewTodoTitle('');
            setNewTodoDescription('');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка');
        }
    };

    // Обновляем задачу
    const updateTodo = async (id: string, updates: TodoUpdate) => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Ошибка обновления задачи:', error);
                alert('Ошибка обновления задачи');
                return;
            }

            // Обновляем задачу в списке
            setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка');
        }
    };

    // Удаляем задачу
    const deleteTodo = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Ошибка удаления задачи:', error);
                alert('Ошибка удаления задачи');
                return;
            }

            // Удаляем задачу из списка
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка');
        }
    };

    // Переключаем статус выполнения задачи
    const toggleTodoComplete = async (id: string, completed: boolean) => {
        await updateTodo(id, { completed: !completed });
    };

    // Начинаем редактирование задачи
    const startEditing = (todo: Todo) => {
        setEditingTodo(todo.id);
        setEditTitle(todo.title);
        setEditDescription(todo.description || '');
    };

    // Сохраняем изменения
    const saveEdit = async () => {
        if (!editingTodo || !editTitle.trim()) {
            alert('Введите название задачи');
            return;
        }

        await updateTodo(editingTodo, {
            title: editTitle.trim(),
            description: editDescription.trim() || undefined,
        });

        setEditingTodo(null);
        setEditTitle('');
        setEditDescription('');
    };

    // Отменяем редактирование
    const cancelEdit = () => {
        setEditingTodo(null);
        setEditTitle('');
        setEditDescription('');
    };

    // Выходим из системы
    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    return (
        <AuthGuard>
            <div className='min-h-screen bg-base-200 flex flex-col items-center px-2'>
                {/* Шапка */}
                <header className='bg-base-100 shadow w-full'>
                    <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex justify-between items-center py-6'>
                            <h1 className='text-3xl font-bold text-base-content'>
                                Мои задачи
                            </h1>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-base-content/70'>
                                    {user?.email}
                                </span>
                                <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={logout}
                                    className='transition-all'
                                >
                                    Выйти
                                </Button>
                                <ThemeSwitcher />
                            </div>
                        </div>
                    </div>
                </header>
                <main className='w-full max-w-2xl flex-1 flex flex-col gap-8 py-6 px-0 sm:px-6 lg:px-8'>
                    {/* Форма создания новой задачи */}
                    <Card className='mb-6 shadow-lg transition-all duration-300 hover:shadow-xl'>
                        <CardHeader>
                            <CardTitle>Создать новую задачу</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={createTodo}
                                className='flex flex-col gap-5'
                            >
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='title'>
                                        Название задачи
                                    </Label>
                                    <Input
                                        id='title'
                                        value={newTodoTitle}
                                        onChange={(e) =>
                                            setNewTodoTitle(e.target.value)
                                        }
                                        placeholder='Что нужно сделать?'
                                        required
                                        autoFocus
                                        className='transition-all focus:ring-2 focus:ring-primary/60'
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='description'>
                                        Описание (необязательно)
                                    </Label>
                                    <textarea
                                        id='description'
                                        value={newTodoDescription}
                                        onChange={(e) =>
                                            setNewTodoDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder='Дополнительные детали...'
                                        rows={3}
                                        className={cn(
                                            'flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                                        )}
                                    />
                                </div>
                                {formError && (
                                    <div className='text-red-500 text-sm'>
                                        {formError}
                                    </div>
                                )}
                                <Button
                                    type='submit'
                                    className='w-full py-3 text-base font-semibold transition-all'
                                >
                                    Добавить задачу
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    {/* Список задач */}
                    <Card className='shadow-lg transition-all duration-300 hover:shadow-xl'>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                Список задач{' '}
                                <Badge
                                    variant={
                                        todos.length ? 'default' : 'secondary'
                                    }
                                >
                                    {todos.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ?
                                <div className='animate-pulse text-center text-base-content/60 py-12 text-lg'>
                                    Загрузка задач...
                                </div>
                            : todos.length === 0 ?
                                <div className='flex flex-col items-center justify-center text-center text-base-content/60 py-12 gap-2'>
                                    <span className='block text-5xl mb-2'>
                                        📝
                                    </span>
                                    <span className='text-lg font-medium'>
                                        У вас пока нет задач
                                    </span>
                                    <span className='text-sm'>
                                        Добавьте первую задачу, чтобы начать!
                                    </span>
                                </div>
                            :   <ul className='flex flex-col gap-5'>
                                    {todos.map((todo) => (
                                        <Card
                                            key={todo.id}
                                            className='relative shadow transition-all duration-200 hover:shadow-md'
                                        >
                                            <CardContent className='flex flex-col sm:flex-row items-start gap-4 p-4'>
                                                <div className='flex items-center gap-3 w-full'>
                                                    <Checkbox
                                                        checked={todo.completed}
                                                        onCheckedChange={() =>
                                                            toggleTodoComplete(
                                                                todo.id,
                                                                todo.completed
                                                            )
                                                        }
                                                        aria-label={
                                                            todo.completed ?
                                                                'Отметить как невыполненную'
                                                            :   'Отметить как выполненную'
                                                        }
                                                        className='scale-125 transition-all'
                                                    />
                                                    <div className='flex-1 min-w-0'>
                                                        <div
                                                            className={`text-base font-medium break-words ${todo.completed ? 'line-through text-base-content/50' : 'text-base-content'} transition-all`}
                                                        >
                                                            {todo.title}
                                                        </div>
                                                        {todo.description && (
                                                            <div
                                                                className={`text-sm break-words ${todo.completed ? 'line-through text-base-content/40' : 'text-base-content/70'} transition-all`}
                                                            >
                                                                {
                                                                    todo.description
                                                                }
                                                            </div>
                                                        )}
                                                        <div className='text-xs text-base-content/40 mt-1'>
                                                            Создано:{' '}
                                                            {new Date(
                                                                todo.created_at
                                                            ).toLocaleString(
                                                                'ru-RU'
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-col gap-2 min-w-[90px]'>
                                                        <Button
                                                            variant='outline'
                                                            size='sm'
                                                            onClick={() =>
                                                                startEditing(
                                                                    todo
                                                                )
                                                            }
                                                            className='transition-all'
                                                        >
                                                            Изменить
                                                        </Button>
                                                        <Button
                                                            variant='destructive'
                                                            size='sm'
                                                            onClick={() =>
                                                                deleteTodo(
                                                                    todo.id
                                                                )
                                                            }
                                                            className='transition-all'
                                                        >
                                                            Удалить
                                                        </Button>
                                                    </div>
                                                    {todo.completed && (
                                                        <Badge
                                                            variant='secondary'
                                                            className='absolute top-2 right-2'
                                                        >
                                                            Выполнено
                                                        </Badge>
                                                    )}
                                                </div>
                                                {/* Режим редактирования */}
                                                {editingTodo === todo.id && (
                                                    <div className='absolute inset-0 bg-base-100/95 flex flex-col justify-center items-center z-10 p-4 rounded-xl shadow-lg'>
                                                        <div className='w-full max-w-md space-y-2'>
                                                            <Input
                                                                value={
                                                                    editTitle
                                                                }
                                                                onChange={(e) =>
                                                                    setEditTitle(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder='Название задачи'
                                                                className='mb-2 transition-all focus:ring-2 focus:ring-primary/60'
                                                            />
                                                            <textarea
                                                                value={
                                                                    editDescription
                                                                }
                                                                onChange={(e) =>
                                                                    setEditDescription(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder='Описание'
                                                                rows={3}
                                                                className={cn(
                                                                    'flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                                                                )}
                                                            />
                                                            <div className='flex gap-2 mt-2'>
                                                                <Button
                                                                    size='sm'
                                                                    onClick={
                                                                        saveEdit
                                                                    }
                                                                    className='transition-all'
                                                                >
                                                                    Сохранить
                                                                </Button>
                                                                <Button
                                                                    variant='outline'
                                                                    size='sm'
                                                                    onClick={
                                                                        cancelEdit
                                                                    }
                                                                    className='transition-all'
                                                                >
                                                                    Отмена
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </ul>
                            }
                        </CardContent>
                    </Card>
                </main>
            </div>
        </AuthGuard>
    );
}
