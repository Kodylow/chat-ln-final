import { IconBolt } from '@tabler/icons-react';
import React, { FC } from 'react';

interface Props {
  onClick: () => void;
}

export const LoginWithLightning: FC<Props> = ({ onClick }) => {
  return (
    <button
      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={onClick}
    >
      <div>
        <IconBolt className="text-yellow-500" />
      </div>
      <span>Login with Lightning</span>
    </button>
  );
};
