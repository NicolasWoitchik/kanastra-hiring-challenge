export class UploadedFileRequestDTO {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: unknown;
  contentEncoding: unknown;
  storageClass: string;
  serverSideEncryption: unknown;
  metadata: Record<string, string>;
  location: string;
  etag: string;
  versionId: undefined;
}
