// GraphQL query strings for the Morpho API.
// Field names verified against the live schema (see verification notes).

export const VAULT_LIST_QUERY = /* GraphQL */ `
  query VaultList($chainIdIn: [Int!], $first: Int) {
    vaultV2s(
      first: $first
      where: { chainId_in: $chainIdIn, listed: true }
      orderBy: TotalAssetsUsd
      orderDirection: Desc
    ) {
      items {
        address
        name
        chain {
          id
          network
        }
        asset {
          symbol
        }
        totalAssetsUsd
        netApy
        avgNetApy
        performanceFee
        managementFee
        rewards {
          asset {
            symbol
          }
          supplyApr
        }
      }
    }
  }
`

export const VAULT_HISTORY_QUERY = /* GraphQL */ `
  query VaultHistory($address: String!, $chainId: Int!, $options: TimeseriesOptions!) {
    vaultV2ByAddress(address: $address, chainId: $chainId) {
      address
      name
      historicalState {
        avgNetApy(options: $options) {
          x
          y
        }
      }
    }
  }
`