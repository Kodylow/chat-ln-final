import { IconCircleCheck } from '@tabler/icons-react';
import QRCode from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import bolt11 from 'bolt11';

type LoginRequest = {
  status: string;
  encoded: string;
  url: string;
};

type LoginModalProps = {
  loginRequest: LoginRequest | null;
  setShowModal: (showModal: boolean) => void;
  onLoginSuccess: () => void;
};

export function LoginModal({
  loginRequest,
  setShowModal,
  onLoginSuccess,
}: LoginModalProps) {
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleCopyClick = () => {
    if (loginRequest) {
      navigator.clipboard.writeText(loginRequest.encoded);
    }
  };

  useEffect(() => {
    console.log('loginRequest:', loginRequest);
    if (loginRequest) {
      setIsReady(true);
    }
  }, [loginRequest]);

  useEffect(() => {
    if (isReady) {
      setModalOpacity(1);
    } else {
      setModalOpacity(0);
    }
  }, [isReady]);

  const handleOpenClick = () => {
    if (loginRequest) {
      window.open(`lightning:${loginRequest.encoded}`);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleOpenClick();
    }
  };

  useEffect(() => {
    if (loginRequest) {
      setIsReady(true);
    }
  }, [loginRequest]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const verifyLogin = async () => {
      if (!loginRequest) return;

      try {
        const response = await fetch('/api/is-logged-in');
        const result = await response.json();
        if (result.logged_in) {
          setStatus('success');
          clearInterval(interval);
          onLoginSuccess();
          setTimeout(() => setShowModal(false), 2000);
        } else {
          setStatus('pending');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('Failed to verify login.');
        clearInterval(interval);
      }
    };

    if (loginRequest) {
      setIsReady(true);
      interval = setInterval(verifyLogin, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [loginRequest, setShowModal, onLoginSuccess]);

  let content = (
    <>
      {loginRequest && (
        <div className="rounded bg-white p-2">
          <QRCode
            value={loginRequest.encoded}
            size={224}
            onClick={handleCopyClick}
            className="h-full w-full cursor-pointer"
          />
        </div>
      )}
    </>
  );

  if (status === 'success') {
    content = (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 256,
          height: 256,
        }}
      >
        <IconCircleCheck size={128} stroke={3} color="green" />
      </div>
    );
  }

  return (
    <div
      className="z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={handleEnter}
    >
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />
          <div
            ref={modalRef}
            className="inline-block max-h-[400px] transform overflow-hidden rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <span
              onClick={() => setShowModal(false)}
              className="close cursor-pointer text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ×
            </span>
            <div className="content-container flex justify-center p-4">
              {content}
            </div>
            <p className="mb-2 text-center">Scan to log in</p>
            <div className="flex justify-center">
              <button
                id="copy-button"
                className="focus:shadow-outline-blue rounded-l-md border border-gray-300 px-4 py-2 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none active:bg-gray-200 dark:border-neutral-500 dark:text-neutral-200 dark:hover:bg-neutral-600 dark:active:bg-neutral-700"
                onClick={handleCopyClick}
              >
                Copy
              </button>
              <button
                id="open-button"
                className="focus:shadow-outline-blue rounded-r-md border border-gray-300 bg-yellow-500 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-yellow-600 focus:outline-none active:bg-yellow-700 dark:border-yellow-500"
                onClick={handleOpenClick}
              >
                Open in ⚡ Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
