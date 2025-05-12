import { Sun } from 'lucide-react';
import { Sidebar } from '../sidebar';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardTitle } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Theme } from '@prisma/client';
import { capitalizeFirst } from '@/lib/capitalizeFirst';
import { colors } from '@/lib/colors';
import { useTheme } from '@/app/_components/ThemeContext';
import { useEffect, useState } from 'react';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';

const Settings = () => {
  const selectedTheme_ = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<Theme>();

  const router = useRouter();
  const setTheme = api.settings.setTheme.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  useEffect(() => {
    setSelectedTheme(selectedTheme_);
  }, []);

  const user = useAuthUser();

  const ThemeComponent = ({ theme }: { theme: string }) => (
    <div className="flex flex-row items-center gap-1">
      <div
        className="size-4 rounded-sm"
        style={{ backgroundColor: colors[theme]![500] }}
      ></div>{' '}
      <div>{capitalizeFirst(theme)}</div>
    </div>
  );

  const SidebarButtons = () => (
    <>
      <Label className="pb-2">General</Label>
      <Button variant={'outline'} size={'sm'} className="justify-start">
        <Sun className="stroke-base-600" />
        Appearance
      </Button>
    </>
  );

  return (
    <div className="grid lg:grid-cols-[250px,1fr]">
      <Sidebar
        sidebarOpen={true}
        className="h-full"
        header={
          <>
            <div className="p-1` flex size-[40px] items-center justify-center rounded-lg border border-blue-300/50 bg-blue-200">
              <div className="flex h-full w-full items-center justify-center rounded-[4px] text-lg font-medium">
                {user?.username[0]}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="text-base font-medium">{user?.username}</div>
              <div className="bg-opacity-50 text-xs font-medium text-base-900">
                {user?.email}
              </div>
            </div>
          </>
        }
      >
        <SidebarButtons />
      </Sidebar>
      <div className="flex flex-col gap-4 p-4">
        <Select>
          <SelectTrigger className="lg:hidden">Appearance</SelectTrigger>
          <SelectContent>
            <div className="flex flex-col p-2">
              <Label className="pb-2">General</Label>
              <Button variant={'outline'} size={'sm'} className="justify-start">
                <Sun className="stroke-base-600" />
                Appearance
              </Button>
            </div>
          </SelectContent>
        </Select>
        <div className="whitespace-nowrap text-sm font-medium text-base-600">
          Appearance
        </div>
        <Card>
          <CardContent className="flex items-center justify-between p-2 ps-4">
            <div className="whitespace-nowrap text-sm font-medium text-base-600">
              Theme
            </div>
            <div className="w-fit">
              <Select
                value={selectedTheme}
                onValueChange={theme => {
                  setSelectedTheme(theme as Theme);
                  setTheme.mutate({ theme });
                }}
              >
                <SelectTrigger>
                  {selectedTheme ? (
                    <ThemeComponent theme={selectedTheme} />
                  ) : (
                    'No theme selected'
                  )}
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(Theme).map(theme => (
                    <SelectItem
                      key={theme}
                      value={theme}
                      className="cursor-pointer hover:bg-base-400"
                    >
                      <ThemeComponent theme={theme} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
