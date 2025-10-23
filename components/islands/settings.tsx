import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';
import { useSettings } from '@/app/_components/SettingsContext';
import { capitalizeFirst } from '@/lib/capitalizeFirst';
import { colors } from '@/lib/colors';
import { api } from '@/trpc/react';
import { Language, Theme } from '@prisma/client';
import { Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from '../sidebar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { toast } from 'sonner';

const Settings = () => {
  const originalSettings = useSettings();
  const [selectedTheme, setSelectedTheme] = useState<Theme>();
  const [selectedShowMediaMetaIn, setSelectedShowMediaMetaIn] =
    useState<Language>();

  const router = useRouter();
  const setTheme = api.settings.setTheme.useMutation({
    onSuccess: () => {
      toast.success(`Set theme to ${selectedTheme}`);
      router.refresh();
    },
  });
  const setShowMediaMetaIn = api.settings.setShowMediaMetaIn.useMutation({
    onSuccess: () => {
      toast.success(
        `Set show media meta to ${selectedShowMediaMetaIn ? selectedShowMediaMetaIn.name : ''}`
      );
      router.refresh();
    },
  });

  const languages = api.settings.getLanguages.useQuery();

  useEffect(() => {
    setSelectedTheme(originalSettings.theme);
    setSelectedShowMediaMetaIn(originalSettings.showMediaMetaIn);
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
            <div className="p-1` flex size-10 items-center justify-center rounded-lg border border-blue-300/50 bg-blue-200">
              <div className="flex h-full w-full items-center justify-center rounded-lg text-lg font-medium">
                {user?.username[0]}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="text-base font-medium">{user?.username}</div>
              <div className="text-xs font-medium text-base-900">
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
          <CardContent className="divide-y divide-base-100 p-0 pe-2 ps-4">
            <div className="flex items-center justify-between py-2">
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
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="whitespace-nowrap text-sm font-medium text-base-600">
                Show media meda in
              </div>
              <div className="w-fit">
                <Select
                  value={
                    selectedShowMediaMetaIn
                      ? selectedShowMediaMetaIn.iso_639_2!
                      : ''
                  }
                  onValueChange={iso_639_2 => {
                    setSelectedShowMediaMetaIn(
                      languages.data!.find(e => e.iso_639_2 === iso_639_2)
                    );
                    setShowMediaMetaIn.mutate({ iso_639_2: iso_639_2 });
                  }}
                >
                  <SelectTrigger>
                    {selectedShowMediaMetaIn
                      ? selectedShowMediaMetaIn.name
                      : 'No language selected'}
                  </SelectTrigger>
                  <SelectContent>
                    {languages.data &&
                      languages.data
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(language => (
                          <SelectItem
                            key={language.id}
                            value={language.iso_639_2!}
                            className="cursor-pointer hover:bg-base-400"
                          >
                            {language.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
