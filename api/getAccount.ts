import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

const rpcURL = 'https://rpc-kralum.neutron-1.neutron.org:443';
const contractAddress =
  'neutron1qdzn3l4kn7gsjna2tfpg3g3mwd6kunx4p50lfya59k02846xas6qslgs3r';

export default async function getBalances(accountId: string) {
  const client = await SigningCosmWasmClient.connect(rpcURL);
  try {
    const queryResult = await client.queryContractSmart(
      contractAddress,
      JSON.parse(`{
      "positions": {
        "account_id": "${accountId}"
      }
    }`)
    );
    return queryResult;
  } catch (error) {
    console.error(error);
  }
}
