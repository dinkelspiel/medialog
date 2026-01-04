'use client';
import { Input } from '@/components/ui/input';
import { UserList } from '@/prisma/generated/browser';
import React, { createRef, useEffect, useState } from 'react';
import { toast } from 'sonner';

const EditableName = ({ userList }: { userList: UserList }) => {
  const [name, setName] = useState(userList.name);

  const updateName = async () => {
    if (name === userList.name) {
      return;
    }

    const response = await (
      await fetch(`/api/user/lists/${userList.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
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
    <Input
      value={name}
      onChange={e => setName(e.target.value)}
      onBlur={() => {
        updateName();
      }}
    />
  );
};

export default EditableName;
