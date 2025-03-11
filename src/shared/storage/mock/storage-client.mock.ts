import { S3Client } from '@aws-sdk/client-s3';

export const s3ClientMock = jest.fn<S3Client, any>(() => ({
  send: jest.fn(),
  config: jest.fn() as unknown as S3Client['config'],
  destroy: jest.fn() as unknown as S3Client['destroy'],
  middlewareStack: jest.fn() as unknown as S3Client['middlewareStack'],
}));
