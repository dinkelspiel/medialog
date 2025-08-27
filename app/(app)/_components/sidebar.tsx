import { SidebarButton } from '@/components/sidebar';
import { Home, UsersRound } from 'lucide-react';

export const SidebarButtons = () => (
  <>
    <SidebarButton href="/dashboard">
      <Home className="size-4 stroke-base-600" />
      Home
    </SidebarButton>
    <SidebarButton href="/community/feed">
      <UsersRound className="size-3" />
      Community
    </SidebarButton>
  </>
);
