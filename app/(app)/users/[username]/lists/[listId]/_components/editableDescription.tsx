'use client';
import { UserList } from '@prisma/client';
import React, { createRef, useEffect, useState } from 'react';
import { toast } from 'sonner';

const EditableDescription = ({ userList }: { userList: UserList }) => {
  const [description, setDescription] = useState(userList.description);
  const ref = createRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.style.height = 'inherit';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  });

  const updateDescription = async () => {
    if (description === userList.description) {
      return;
    }

    const response = await (
      await fetch(`/api/user/lists/${userList.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          description,
        }),
      })
    ).json();

    if (response.error) {
      toast.error(`Error updating list: ${response.error}`);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <textarea
      ref={ref}
      onInput={e => {
        (e.target as any).style.height = 'inherit';
        (e.target as any).style.height = `${(e.target as any).scrollHeight}px`;
      }}
      value={description}
      onChange={e => setDescription(e.target.value)}
      onBlur={() => {
        updateDescription();
      }}
      className="h-max resize-none bg-neutral-100 text-base text-neutral-700"
    />
  );
};

export default EditableDescription;
