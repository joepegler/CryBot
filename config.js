module.exports = {
    exchanges: {
        binance: {
            credentials:{
                key: '',
                secret: ''
            },
            pairs: {
                btcusd:'btcusdt',
                ltcbtc:'ltcbtc',
                ethbtc:'ethbtc'
            },
            url: {
                rest: '',
                ws: 'wss://stream.binance.com:9443/ws'
            }
        },
        bitstamp : {
            credentials: {
                key: '',
                secret: ''
            },
            pairs: {
                btcusd:'btcusd',
                ltcbtc:'ltcbtc',
                ethbtc:'ethbtc'
            },
            url: {
                rest: '',
                ws: ''
            }
        },
        bittrex : {
            credentials:{
                key: '',
                secret: ''
            },
            pairs: {
                btcusd:'USDT-BTC',
                ltcbtc:'BTC-LTC',
                ethbtc:'BTC-ETH'
            },
            url: {
                rest: '',
                ws: ''
            }
        },
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
        },
        hitbtc : {
            credentials:{
                key: '',
                secret: ''
            },
            pairs: {
                btcusd: 'BTCUSD',
                ltcbtc: 'LTCBTC',
                ethbtc: 'ETHBTC'
            },
            url: {
                rest: 'http://api.hitbtc.com',
                ws: 'api.hitbtc.com'
            }
        }
    }
};