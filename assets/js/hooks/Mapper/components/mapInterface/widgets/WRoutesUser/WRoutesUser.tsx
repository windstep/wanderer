import { Commands, OutCommand } from '@/hooks/Mapper/types';
import { useMapRootState } from '@/hooks/Mapper/mapRootProvider';
import {
  AddHubCommand,
  LoadRoutesCommand,
  RoutesImperativeHandle,
} from '@/hooks/Mapper/components/mapInterface/widgets/RoutesWidget/types.ts';
import { useCallback, useRef } from 'react';
import { RoutesWidget } from '@/hooks/Mapper/components/mapInterface/widgets';
import { useMapEventListener } from '@/hooks/Mapper/events';

export const WRoutesUser = () => {
  const {
    outCommand,
    storedSettings: { settingsRoutes, settingsRoutesUpdate },
    data: { userHubs, userRoutes },
  } = useMapRootState();

  const ref = useRef<RoutesImperativeHandle>(null);

  const loadRoutesCommand: LoadRoutesCommand = useCallback(
    async (systemId, routesSettings) => {
      outCommand({
        type: OutCommand.getUserRoutes,
        data: {
          system_id: systemId,
          routes_settings: routesSettings,
        },
      });
    },
    [outCommand],
  );

  const addHubCommand: AddHubCommand = useCallback(
    async systemId => {
      if (userHubs.includes(systemId)) {
        return;
      }

      await outCommand({
        type: OutCommand.addUserHub,
        data: { system_id: systemId },
      });
    },
    [userHubs, outCommand],
  );

  const toggleHubCommand: AddHubCommand = useCallback(
    async (systemId: string | undefined) => {
      if (!systemId) {
        return;
      }

      outCommand({
        type: !userHubs.includes(systemId) ? OutCommand.addUserHub : OutCommand.deleteUserHub,
        data: {
          system_id: systemId,
        },
      });
    },
    [userHubs, outCommand],
  );

  useMapEventListener(event => {
    if (event.name === Commands.userRoutes) {
      ref.current?.stopLoading();
    }
    return true;
  });

  return (
    <RoutesWidget
      ref={ref}
      title="User Routes"
      data={settingsRoutes}
      update={settingsRoutesUpdate}
      hubs={userHubs}
      routesList={userRoutes}
      loadRoutesCommand={loadRoutesCommand}
      addHubCommand={addHubCommand}
      toggleHubCommand={toggleHubCommand}
      isRestricted
    />
  );
};
