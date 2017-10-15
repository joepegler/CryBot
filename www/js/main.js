let socket = io();
const smoothieOptions = {
    yMinFormatter: function (min) {
        return parseFloat(min).toFixed(8);
    },
    yMaxFormatter: function (max) {
        return parseFloat(max).toFixed(8);
    },
    millisPerPixel: 50,
    grid: {
        strokeStyle: '#555555',
        lineWidth: 1,
        millisPerLine: 1000,
        verticalSections: 2,
    }
};

let prices = {
    // btcusd: {
    //      chart: new SmoothieChart(),
    //      poloniex: new TimeSeries(),
    //      bitfinex: new TimeSeries(),
    // },...
};

let exchangeOptions = {};
const seriesOptions = [
    { strokeStyle: 'rgba(230, 25, 75, 1)', fillStyle: 'rgba(230, 25, 75, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(60, 180, 75, 1)', fillStyle: 'rgba(60, 180, 75, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(255, 225, 25, 1)', fillStyle: 'rgba(255, 225, 25, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(0, 130, 200, 1)', fillStyle: 'rgba(0, 130, 200, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(245, 130, 48, 1)', fillStyle: 'rgba(245, 130, 48, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(145, 30, 180, 1)', fillStyle: 'rgba(145, 30, 180, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(70, 240, 240, 1)', fillStyle: 'rgba(70, 240, 240, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(240, 50, 230, 1)', fillStyle: 'rgba(240, 50, 230, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(210, 245, 60, 1)', fillStyle: 'rgba(210, 245, 60, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(250, 190, 190, 1)', fillStyle: 'rgba(250, 190, 190, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(0, 128, 128, 1)', fillStyle: 'rgba(0, 128, 128, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(230, 190, 255, 1)', fillStyle: 'rgba(230, 190, 255, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(170, 110, 40, 1)', fillStyle: 'rgba(170, 110, 40, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(255, 250, 200, 1)', fillStyle: 'rgba(255, 250, 200, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(128, 0, 0, 1)', fillStyle: 'rgba(128, 0, 0, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(170, 255, 195, 1)', fillStyle: 'rgba(170, 255, 195, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(128, 128, 0, 1)', fillStyle: 'rgba(128, 128, 0, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(255, 215, 180, 1)', fillStyle: 'rgba(255, 215, 180, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(0, 0, 128, 1)', fillStyle: 'rgba(0, 0, 128, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(128, 128, 128, 1)', fillStyle: 'rgba(128, 128, 128, 0.1)', lineWidth: 3 }
];

function init() {

    socket.on('price', pricePoint => {
        // { ts, pair, amount, rate, id, type, exchange }
        console.info(pricePoint.exchange + ': ' + JSON.stringify(pricePoint));
        if(!prices[pricePoint.pair]) {
            prices[pricePoint.pair] = {};
            if(!prices[pricePoint.pair].chart){
                createCanvas(pricePoint.pair);
                prices[pricePoint.pair].chart = new SmoothieChart(smoothieOptions);
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
    canvas.height = 100;

    let h3 = document.createElement("h3");
    h3.textContent = pair;

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(h3);
    body.appendChild(canvas);
}