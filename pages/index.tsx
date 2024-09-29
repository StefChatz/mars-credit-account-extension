'use client';

import { useEffect, useState } from 'react';
import getAccount from '../api/getAccount';
import getPrices from '../api/getPrices';
import styles from './home.module.css';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [data, setData] = useState<any>(null);
  const [prices, setPrices] = useState<any>(null);

  useEffect(() => {
    // Load the cached account ID when the component mounts
    const cachedAccountId = localStorage.getItem('cachedAccountId');
    if (cachedAccountId) {
      setAccountId(cachedAccountId);
      handleFetch(cachedAccountId);
    }
  }, []);

  const handleFetch = async (id: string = accountId) => {
    setLoading(true);
    const accountData = await getAccount(id);
    const pricesData = await getPrices();
    console.log(pricesData);
    setData(accountData);
    setPrices(pricesData);
    setLoading(false);

    // Cache the account ID
    localStorage.setItem('cachedAccountId', id);
  };

  const getTokenInfo = (denom: string) => {
    const tokenInfo = prices?.find((token: any) => token.denom === denom);
    return tokenInfo || { decimals: 0, priceUSD: 0, symbol: denom, icon: '' };
  };

  const convertAmount = (amount: string, denom: string) => {
    const { decimals } = getTokenInfo(denom);
    return parseFloat(amount) / Math.pow(10, decimals);
  };

  const calculateTotalBalance = (data: any) => {
    const sumAmounts = (items: any[]) =>
      items.reduce(
        (sum, item) => sum + convertAmount(item.amount, item.denom),
        0
      );
    const deposits = sumAmounts(data.deposits || []);
    const lends = sumAmounts(data.lends || []);
    const stakedAstroLps = sumAmounts(data.staked_astro_lps || []);
    const vaults = sumAmounts(data.vaults || []);
    return deposits + lends + stakedAstroLps + vaults;
  };

  const calculateTotalDebts = (data: any) => {
    return data.debts.reduce(
      (sum, debt) => sum + convertAmount(debt.amount, debt.denom),
      0
    );
  };

  const calculateUsdValue = (amount: number, denom: string) => {
    const { priceUSD } = getTokenInfo(denom);
    return amount * priceUSD;
  };

  const totalBalance = data ? calculateTotalBalance(data) : 0;
  const totalDebts = data ? calculateTotalDebts(data) : 0;
  const netWorth = totalBalance - totalDebts;

  const totalBalanceUsd = data
    ? data.deposits
        .concat(data.lends, data.staked_astro_lps, data.vaults)
        .reduce((sum: number, item: any) => {
          return (
            sum +
            calculateUsdValue(
              convertAmount(item.amount, item.denom),
              item.denom
            )
          );
        }, 0)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className={styles.input}
        />
        <button
          className={styles.fetchButton}
          onClick={() => handleFetch()}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Accounts'}
        </button>
      </div>
      {data && (
        <div className={styles.container}>
          <h3 className={styles.title}>Balances</h3>
          <div className={styles.accountInfo}>
            <div>
              Account ID:{' '}
              <span className={styles.accountValue}>{data.account_id}</span>
            </div>
            <div>
              Total Balance:{' '}
              <span className={styles.accountValue}>
                ${totalBalanceUsd.toFixed(2)}
              </span>
            </div>
            <div>
              Total Debt:{' '}
              <span className={styles.accountValue}>
                ${totalDebts.toFixed(2)}
              </span>
            </div>
            <div>
              Net Worth:{' '}
              <span className={styles.accountValue}>
                ${(totalBalanceUsd - totalDebts).toFixed(2)}
              </span>
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.assetHeader}>Asset</th>
                <th className={styles.valueHeader}>Value</th>
                <th className={styles.sizeHeader}>Size</th>
              </tr>
            </thead>
            <tbody>
              {data.deposits
                .concat(data.lends, data.staked_astro_lps, data.vaults)
                .map((item: any, index: number) => {
                  const { symbol, icon } = getTokenInfo(item.denom);
                  const isLent = data.lends.includes(item);
                  const isStaked = data.staked_astro_lps.includes(item);
                  return (
                    <tr key={index}>
                      <td className={styles.assetCell}>
                        {icon && (
                          <img
                            src={icon}
                            alt={symbol}
                            width={20}
                            height={20}
                            className={styles.assetIcon}
                          />
                        )}
                        <span className={styles.assetName}>{symbol}</span>
                        {isLent && (
                          <span className={styles.lentText}>(lent)</span>
                        )}
                        {isStaked && (
                          <span className={styles.stakedText}>(staked)</span>
                        )}
                      </td>
                      <td className={styles.valueCell}>
                        $
                        {calculateUsdValue(
                          convertAmount(item.amount, item.denom),
                          item.denom
                        ).toFixed(2)}
                      </td>
                      <td className={styles.sizeCell}>
                        {convertAmount(item.amount, item.denom).toFixed(6)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
