import { LogLevel } from '@nestjs/common';

/** returns an array of events to be processed by Logger
 * 1 - 'error' - base level. includes errors only
 * 2 - 'warn'
 * 3 - 'log'
 * 4 - 'verbose'
 * 5 - 'debug' - top level includes all types of events
 */
export const LOGGER_CONFIG: LogLevel[] = ['debug'];
