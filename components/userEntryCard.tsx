import { Book, Film, Tv } from 'lucide-react';
import SmallRating from './smallRating';
import { Category } from '@prisma/client';
import { HTMLProps } from 'react';
import Image from 'next/image';

const UserEntryCard = ({
  title,
  backgroundImage,
  category,
  releaseDate,
  rating,
  ...props
}: {
  title: string;
  backgroundImage: string;
  category: Category;
  releaseDate: Date;
  rating: number;
} & HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className="relative aspect-[2/3] w-full cursor-pointer overflow-clip rounded-lg bg-cover shadow-md"
      {...props}
    >
      <div className="relative h-full w-full">
        <Image
          src={backgroundImage}
          alt={title}
          width={350}
          height={350 * (3 / 2)}
        />
      </div>
      <div className="p-2">
        {(() => {
          switch (category) {
            case 'Book':
              return <Book className="size-5 stroke-white" />;
            case 'Movie':
              return <Film className="size-5 stroke-white" />;
            case 'Series':
              return <Tv className="size-5 stroke-white" />;
          }
        })()}
      </div>
      <div className="select-none text-transparent">{title}</div>
      <div className="absolute top-[40%] flex h-[60%] w-full flex-col justify-end rounded-bl-lg rounded-br-lg bg-gradient-to-t from-slate-900 to-transparent object-cover p-2">
        <div className="text-left font-semibold text-white">{title}</div>
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-slate-400">
            {releaseDate.getFullYear()}
          </div>
          <div className="text-white">
            <SmallRating rating={rating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEntryCard;
