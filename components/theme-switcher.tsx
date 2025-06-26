'use client';

import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themes = ['light', 'dark', 'system'] as const;

type ThemeType = (typeof themes)[number];

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const ICON_SIZE = 20;
    const getIcon = (t: ThemeType) => {
        if (t === 'light')
            return (
                <Sun
                    size={ICON_SIZE}
                    className='text-muted-foreground'
                />
            );
        if (t === 'dark')
            return (
                <Moon
                    size={ICON_SIZE}
                    className='text-muted-foreground'
                />
            );
        return (
            <Laptop
                size={ICON_SIZE}
                className='text-muted-foreground'
            />
        );
    };

    const handleClick = () => {
        const idx = themes.indexOf((theme as ThemeType) || 'system');
        const nextTheme = themes[(idx + 1) % themes.length];
        setTheme(nextTheme);
    };

    return (
        <Button
            variant='ghost'
            size='icon'
            onClick={handleClick}
            aria-label='Сменить тему'
        >
            {getIcon((theme as ThemeType) || 'system')}
        </Button>
    );
};

export { ThemeSwitcher };

