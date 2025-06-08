'use client';

import React, { useEffect } from 'react';
import { StateList, useListState } from '../state';

const PopulateState = ({ list }: { list: StateList }) => {
  const { setList } = useListState();

  useEffect(() => {
    setList(list);
  }, [list]);

  return '';
};

export default PopulateState;
