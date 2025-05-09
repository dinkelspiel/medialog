import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-base-100 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-base-500',
          actionButton:
            'group-[.toast]:bg-base-500 group-[.toast]:text-base-500-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-base-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
