import { create } from 'ipfs-http-client';

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export const uploadIpfs = async (data) => {
  const result = await client.add(JSON.stringify(data));
  console.log("uploadIpfs result: ", result);
  return result;
}