"use client";
import { Button } from '@/components/ui/button';
import { Entry } from '@/prisma/generated/browser';
import { api } from '@/trpc/react';
import { Loader2, RotateCw } from 'lucide-react';
import React from 'react'

const CheckForUpdates = ({entry}: {entry: Entry}) => {
    const collection = api.entry.getCollection.useQuery({
        entryId: entry.id
    })
    const reimport = api.import.series.useMutation()

  return (
    <Button size={"sm"} variant={"ghost"} disabled={collection.isPending || reimport.isPending} onClick={() => {
        console.log(collection.data, collection.isPending)
        if(!collection.data?.foreignId) { console.log("No collection foreign id "); return;}
        if(isNaN(parseInt(collection.data?.foreignId))) {console.log("foreign id is not a number");  return;}

        reimport.mutate({
            tmdbId: parseInt(collection.data?.foreignId)
        })
    }}>{(collection.isPending || reimport.isPending) ? <Loader2 className='size-4 stroke-base-600 animate-spin' /> : <RotateCw className='size-4 stroke-base-600' />} Check For Updates</Button>
  )
}

export default CheckForUpdates