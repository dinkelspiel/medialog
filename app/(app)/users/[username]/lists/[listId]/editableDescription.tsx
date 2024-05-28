'use client';
import React, { createRef, useEffect } from 'react';

const EditableDescription = ({ description }: { description: string }) => {
  const ref = createRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.style.height = 'inherit';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  });

  return (
    <textarea
      ref={ref}
      onInput={e => {
        (e.target as any).style.height = 'inherit';
        (e.target as any).style.height = `${(e.target as any).scrollHeight}px`;
      }}
      defaultValue={description}
      className="h-max resize-none text-base text-gray-700"
    />
  );
};

export default EditableDescription;
