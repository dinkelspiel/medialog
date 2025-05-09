import { SidebarButton } from '@/components/sidebar';
import { Home, UsersRound } from 'lucide-react';

export const SidebarButtons = () => (
  <>
    <SidebarButton href="/dashboard">
      <Home className="stroke-base-600 size-4" />
      Home
    </SidebarButton>
    <SidebarButton href="/community">
      <UsersRound className="size-3" />
      Community
    </SidebarButton>
  </>
);
