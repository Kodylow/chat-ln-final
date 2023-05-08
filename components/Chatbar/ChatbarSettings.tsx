import { SupportedExportFormats } from '@/types/export';
import { PluginKey } from '@/types/plugin';
import {
  IconBolt,
  IconFileExport,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { Import } from '../Settings/Import';
import { Key } from '../Settings/Key';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';
import { LoginWithLightning } from '../Sidebar/LoginWithLightning';
import { LoginModal } from '../Lightning/LoginModal';

interface Props {
  lightMode: 'light' | 'dark';
  apiKey: string;
  serverSideApiKeyIsSet: boolean;
  pluginKeys: PluginKey[];
  serverSidePluginKeysSet: boolean;
  conversationsCount: number;
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onApiKeyChange: (apiKey: string) => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: SupportedExportFormats) => void;
  onPluginKeyChange: (pluginKey: PluginKey) => void;
  onClearPluginKey: (pluginKey: PluginKey) => void;
  isWebLnEnabled: boolean;
  setIsWebLnEnabled: (enabled: boolean) => void;
  userPubkey: string;
  setUserPubkey: (pubkey: string) => void;
}

export const ChatbarSettings: FC<Props> = ({
  lightMode,
  apiKey,
  serverSideApiKeyIsSet,
  pluginKeys,
  serverSidePluginKeysSet,
  conversationsCount,
  onToggleLightMode,
  onApiKeyChange,
  onClearConversations,
  onExportConversations,
  onImportConversations,
  onPluginKeyChange,
  onClearPluginKey,
  isWebLnEnabled,
  setIsWebLnEnabled,
  userPubkey,
  setUserPubkey
}) => {
  const { t } = useTranslation('sidebar');
  const [showModal, setShowModal] = useState(false);
  const [loginRequest, setLoginRequest] = useState("");

  const handleLoginClick = async () => {
    try {
      const response = await fetch('/api/lnurl-challenge');
      console.log('get-login-url response', response)
      const data = await response.json();
      console.log('get-login-url data', data.lnurl)
      setLoginRequest(data.lnurl);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching login URL:', error);
    }
  };

  const handleLoginSuccess = (pubkey: string) => {
    // Perform any action needed after a successful login, e.g., redirect or fetch user data
    setShowModal(false);

    setUserPubkey(pubkey);
  };

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversationsCount > 0 ? (
        <ClearConversations onClearConversations={onClearConversations} />
      ) : null}

      <SidebarButton
        text={`WebLn ${isWebLnEnabled ? 'En' : 'Dis'}abled`}
        icon={<IconBolt size={18} />}
        onClick={async () => {
          if (!window.webln) {
            alert('No webln wallet - try Alby!');
            return;
          }
          window.webln.isEnabled = !window.webln.isEnabled;
          setIsWebLnEnabled(window.webln.isEnabled);
        }}
      />

      <LoginWithLightning setUserPubkey={setUserPubkey} userPubkey={userPubkey} onClick={handleLoginClick} />

      {showModal && (
        <LoginModal
          loginRequest={loginRequest}
          setShowModal={setShowModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};
