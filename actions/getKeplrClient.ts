import { getKeplrFromWindow } from '@keplr-wallet/stores';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import Neutron1 from '../config/neutron-1';

export const getKeplrClient = async (address: string) => {
  if (!address) {
    alert('Please connect to Keplr wallet first.');
    return null;
  }

  const keplr = await getKeplrFromWindow();
  if (!keplr) {
    alert('Keplr extension not found.');
    return null;
  }

  await keplr.enable(Neutron1.id);
  const offlineSigner = keplr.getOfflineSigner(Neutron1.id);

  return SigningCosmWasmClient.connectWithSigner(
    Neutron1.endpoints.rpc,
    offlineSigner,
    {
      gasPrice: GasPrice.fromString('0.1uosmo'),
    }
  );
};
