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
                btcusd: 'BTCUSD',
                ltcbtc:'LTCBTC',
                ethbtc:'ETHBTC'
            },
            url: {
                rest: '',
                ws: 'wss://api.poloniex.com'
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
                ws: 'wss://api.poloniex.com'
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