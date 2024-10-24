import { TestEnvironment } from './test-environment';

export default async (): Promise<void> => {
  await TestEnvironment.shutdownEnvironment();
};
