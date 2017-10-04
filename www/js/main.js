let socket = io();

let prices = {
    // btcusd: {
    //      chart: new SmoothieChart(),
    //      poloniex: new TimeSeries(),
    //      bitfinex: new TimeSeries(),
    // },...
};

let exchangeOptions = {};
const seriesOptions = [
    { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(0, 0, 255, 1)', fillStyle: 'rgba(0, 0, 255, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(255, 255, 0, 1)', fillStyle: 'rgba(255, 255, 0, 0.1)', lineWidth: 3 }
];

function init() {
    socket.on('price', pricePoint => {
        // { ts, pair, amount, rate, id, type, exchange }
        if(!prices[pricePoint.pair]) {
            prices[pricePoint.pair] = {};
            if(!prices[pricePoint.pair].chart){
                createCanvas(pricePoint.pair);
                prices[pricePoint.pair].chart = new SmoothieChart({ millisPerPixel: 20, grid: { strokeStyle: '#555555', lineWidth: 1, millisPerLine: 1000, verticalSections: 3 }});
                prices[pricePoint.pair].chart.streamTo(document.getElementById(pricePoint.pair + '-canvas'), 1000);
            }
        }
        if(!prices[pricePoint.pair][pricePoint.exchange]){
            prices[pricePoint.pair][pricePoint.exchange] = new TimeSeries();
            if(!exchangeOptions[pricePoint.exchange]) {
                exchangeOptions[pricePoint.exchange] = seriesOptions.shift();
            }
            prices[pricePoint.pair].chart.addTimeSeries(prices[pricePoint.pair][pricePoint.exchange], exchangeOptions[pricePoint.exchange]);
        }
        prices[pricePoint.pair][pricePoint.exchange].append( pricePoint.ts * 1000, pricePoint.rate );
    });
}

function createCanvas(pair){
    let canvas = document.createElement('canvas');
    canvas.id = pair + '-canvas';
    canvas.width = 500;
    canvas.height = 200;

    let h3 = document.createElement("h3");
    h3.textContent = pair;

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(h3);
    body.appendChild(canvas);
}