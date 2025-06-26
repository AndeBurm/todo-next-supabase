import Link from 'next/link';

export default function HomePage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
            <div className='max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold text-gray-900 mb-2'>
                        ToDo App
                    </h1>
                    <p className='text-gray-600'>
                        Управляйте своими задачами эффективно
                    </p>
                </div>

                <div className='space-y-4'>
                    <Link
                        href='/auth/sign-up'
                        className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out'
                    >
                        Зарегистрироваться
                    </Link>

                    <Link
                        href='/auth/login'
                        className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out'
                    >
                        Войти
                    </Link>
                </div>

                <div className='text-center'>
                    <p className='text-xs text-gray-500'>
                        Создано с помощью Next.js + Supabase
                    </p>
                </div>
            </div>
        </div>
    );
}

