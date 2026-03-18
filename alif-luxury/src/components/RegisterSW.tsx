// @ts-expect-error virtual module from vite-plugin-pwa
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect } from 'react';

export function RegisterSW() {
  const {
    needRefresh,
    setNeedRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: unknown) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error: unknown) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      // Banners disabled per user request
      /*
      toast(
        ...
      );
      */
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  return null;
}
