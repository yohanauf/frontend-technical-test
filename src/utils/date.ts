import { fromUnixTime, formatDistance } from 'date-fns';

export const getDistanceDateFromTimestamp = (timestamp: number) => {
  return formatDistance(fromUnixTime(timestamp), Date.now(), {
    addSuffix: true,
  });
};
