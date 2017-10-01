module.exports = {
    exchanges: {
        poloniex : {
            credentials:{
                key: '',
                secret: ''
            },
            pairs: {
                btcusd:'USDT_BTC',
                ltcbtc:'BTC_LTC',
                ethbtc:'BTC_ETH'
            },
            url: {
                rest: '',
                ws: 'wss://api2.poloniex.com'
            }
        },
        bitfinex : {
            credentials:{
                key: '',
                secret: ''
            },
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
            credentials:{
                key: '',
                secret: ''
            },
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
            credentials:{
                key: '',
                secret: ''
            },
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