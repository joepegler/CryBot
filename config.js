module.exports = {
    exchanges: {
        poloniex : {
            pairs: {
                btcusd: 'USDT_BTC',
                ltcbtc:'BTC_LTC',
                ethbtc:'BTC_ETH'
            },
            url: {
                rest: '',
                ws: 'wss://api.poloniex.com'
            }
        },
        bitfinex : {
            pairs: {
                btcusd: 'tBTCUSD',
                ltcbtc:'tLTCBTC',
                ethbtc:'tETHBTC'
            },
            url: {
                rest: '',
                ws: 'wss://api.bitfinex.com/ws/2'
            }
        },
        gdax : {
            pairs: {
                btcusd: 'BTC-USD',
                ltcbtc:'LTC-BTC',
                ethbtc:'ETH-BTC'
            },
            url: {
                rest: '',
                ws: ''
            }
        },
        kraken : {
            pairs: {
                btcusd: 'XXBTZUSD',
                ltcbtc: 'XLTCXXBT',
                ethbtc: 'XETHXXBT'
            },
            url: {
                rest: '',
                ws: ''
            }
        }
    }
};