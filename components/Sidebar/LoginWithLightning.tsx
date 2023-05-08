import { IconBolt } from '@tabler/icons-react';
import React, { FC } from 'react';

interface Props {
  setUserPubkey: (pubkey: string) => void;
  userPubkey: string;
  onClick: () => void;
}

export const LoginWithLightning: FC<Props> = ({ setUserPubkey, userPubkey, onClick }) => {
  const handleLogout = () => {
    setUserPubkey("");
    localStorage.setItem("userPubkey", "")
  };
  return (
    <button
      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={userPubkey ? handleLogout : onClick}
    >
      <div>
        <IconBolt className="text-yellow-500" />
      </div>
      
      <span>{userPubkey ? "Pubkey:" + userPubkey.slice(0, 8) + "..." + userPubkey.slice(-8) : "Login with Lightning"}</span>
    </button>
  );
};
