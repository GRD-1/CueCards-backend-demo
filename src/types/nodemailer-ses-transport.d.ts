declare module 'nodemailer-ses-transport' {
  import { TransportOptions } from 'nodemailer';

  function sesTransport(options: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    sessionToken?: string;
    httpOptions?: object;
    rateLimit?: number;
    maxConnections?: number;
  }): TransportOptions;

  export = sesTransport;
}
