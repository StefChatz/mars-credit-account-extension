export default async function getPrices() {
  try {
    const response = await fetch(
      'https://api.astroport.fi/api/tokens?chainId=neutron-1'
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
