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
}) => {
  const { t } = useTranslation('sidebar');
  const [showModal, setShowModal] = useState(false);
  const [loginRequest, setLoginRequest] = useState(null);

  const handleLoginClick = async () => {
    try {
      const response = await fetch('/api/get-login-url');
      const data = await response.json();
      setLoginRequest(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching login URL:', error);
    }
  };

  const handleLoginSuccess = () => {
    // Perform any action needed after a successful login, e.g., redirect or fetch user data
  };

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversationsCount > 0 ? (
        <ClearConversations onClearConversations={onClearConversations} />
      ) : null}

      <Import onImport={onImportConversations} />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => onExportConversations()}
      />

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

      {!(serverSideApiKeyIsSet) ? (
        <Key apiKey={apiKey} onApiKeyChange={onApiKeyChange} />
      ) : null}

      {!(serverSidePluginKeysSet) ? (
        <PluginKeys
          pluginKeys={pluginKeys}
          onPluginKeyChange={onPluginKeyChange}
          onClearPluginKey={onClearPluginKey}
        />
      ) : null}
      <LoginWithLightning onClick={handleLoginClick} />

      <Key apiKey={apiKey} onApiKeyChange={onApiKeyChange} />

      <PluginKeys
        pluginKeys={pluginKeys}
        onPluginKeyChange={onPluginKeyChange}
        onClearPluginKey={onClearPluginKey}
      />

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
