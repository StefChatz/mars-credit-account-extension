'use client';

import { useState } from 'react';
import getAccount from '../api/getAccount';
import { getKeplrClient } from '../actions/getKeplrClient';
import Neutron1 from '../config/neutron-1';

const FetchAccountsButton = () => {
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [data, setData] = useState<any>(null);

  const handleFetch = async () => {
    const client = await getKeplrClient(
      'neutron15prdxhy6lg6rew76gjv07q59c5j6a78p47j9ht'
    );

    setLoading(true);
    const data = await getAccount(
      client,
      Neutron1.contracts.creditManager,
      accountId
    );
    setData(data);
    setLoading(false);
  };

  const calculateTotalBalance = (data: any) => {
    const sumAmounts = (items: any[]) =>
      items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const deposits = sumAmounts(data.deposits || []);
    const lends = sumAmounts(data.lends || []);
    const stakedAstroLps = sumAmounts(data.stakedAstroLps || []);
    const vaults = sumAmounts(data.vaults || []);
    return deposits + lends + stakedAstroLps + vaults;
  };

  const calculateTotalDebts = (data: any) => {
    return data.debts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
  };

  const totalBalance = data ? calculateTotalBalance(data) : 0;
  const totalDebts = data ? calculateTotalDebts(data) : 0;
  const netWorth = totalBalance - totalDebts;

  return (
    <>
      <input
        type="text"
        placeholder="Enter account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
      />
      <button
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={handleFetch}
      >
        {loading ? 'Loading...' : 'Fetch Accounts'}
      </button>
      {data && (
        <div>
          {data.debts.length > 0 && (
            <div>
              <h3>Debts</h3>
              <pre>{JSON.stringify(data.debts, null, 2)}</pre>
            </div>
          )}
          {data.deposits.length > 0 && (
            <div>
              <h3>Deposits</h3>
              <pre>{JSON.stringify(data.deposits, null, 2)}</pre>
            </div>
          )}
          {data.lends.length > 0 && (
            <div>
              <h3>Lends</h3>
              <pre>{JSON.stringify(data.lends, null, 2)}</pre>
            </div>
          )}
          {data.stakedAstroLps.length > 0 && (
            <div>
              <h3>Staked Astro LPs</h3>
              <pre>{JSON.stringify(data.stakedAstroLps, null, 2)}</pre>
            </div>
          )}
          {data.vaults.length > 0 && (
            <div>
              <h3>Vaults</h3>
              <pre>{JSON.stringify(data.vaults, null, 2)}</pre>
            </div>
          )}
          <div>
            <h3>Total Balance: {totalBalance}</h3>
            <h3>Total Net Worth: {netWorth}</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default FetchAccountsButton;
