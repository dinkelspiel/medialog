'use client';

import { Dispatch, memo, ReactNode, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export const IslandDialog = memo(
  ({
    open,
    setOpen,
    children,
    title,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
    title: string;
  }) => {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="no-scrollbar box-border h-[100vh] overflow-x-clip overflow-y-scroll border-2 border-base-200 p-0 lg:h-full lg:max-h-[calc(100vh-64px)] lg:max-w-[calc(100vw-64px)]">
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only">{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);
