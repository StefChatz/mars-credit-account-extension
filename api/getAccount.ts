import { MarsCreditManagerQueryClient } from '../mars-credit-manager/MarsCreditManager.client';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

interface AccountDetails {
  accountId: string;
  accountKind: any;
  debts: any[];
  deposits: any[];
  lends: any[];
  stakedAstroLps: any[];
  vaults: any[];
  perpVault?: any | null;
  perps?: any[];
}

async function getAccount(
  client: CosmWasmClient,
  contractAddress: string,
  accountId: string
): Promise<AccountDetails> {
  const queryClient = new MarsCreditManagerQueryClient(client, contractAddress);

  const positions = await queryClient.positions({ accountId });

  return {
    accountId: positions.account_id,
    accountKind: positions.account_kind,
    debts: positions.debts,
    deposits: positions.deposits,
    lends: positions.lends,
    stakedAstroLps: positions.staked_astro_lps,
    vaults: positions.vaults,
    perpVault: positions.perp_vault,
    perps: positions.perps,
  };
}

export default getAccount;
