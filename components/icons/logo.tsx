import { cn } from '@/lib/utils';
import React, { SVGProps } from 'react';

const Logo = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-11 rounded-lg', className)}
      {...props}
    >
      <rect width="64" height="64" rx="8" fill="#D74323" />
      <rect width="64" height="60" rx="8" fill="#E05F43" />
      <path
        d="M18.2283 40H13L17.8261 20H24.462L28.6848 33.2673L32.9076 20H40.5489V35.6436H50V40H35.5217V25.5446L30.8967 40H25.6685L21.8478 25.5446L18.2283 40Z"
        fill="white"
      />
    </svg>
  );
};

export default Logo;
