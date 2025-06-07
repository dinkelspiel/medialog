import React, { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircleIcon } from 'lucide-react';

const Error = ({
  title,
  children,
}: {
  title: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
};

export default Error;
