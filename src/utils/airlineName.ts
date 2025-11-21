import airlineNames from '../data/airlineNames.json';
import airlinePrefixes from '../data/airlinePrefixes.json';

const directNames = airlineNames as Record<string, string>;
const prefixNames = airlinePrefixes as Record<string, string>;

const extractPrefix = (code?: string): string => {
  if (!code) return '';
  const match = code.toUpperCase().match(/^[A-Z]+/);
  return match ? match[0] : code.toUpperCase();
};

export interface AirlineInfo {
  code: string;
  name: string;
  displayName: string;
}

export const resolveAirlineInfo = (airlineCode?: string): AirlineInfo => {
  if (!airlineCode) {
    return { code: 'N/A', name: 'N/A', displayName: 'N/A' };
  }

  const upperCode = airlineCode.toUpperCase();
  const prefix = extractPrefix(upperCode);

  const name =
    directNames[upperCode] ||
    prefixNames[prefix] ||
    upperCode;

  return {
    code: prefix || upperCode,
    name,
    displayName: name,
  };
};

export const resolveAirlineName = (airlineCode?: string): string =>
  resolveAirlineInfo(airlineCode).displayName;
