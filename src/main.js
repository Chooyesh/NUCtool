const { listen } = window.__TAURI__.event;

// 左风扇曲线
const leftFanCtx = document.getElementById('leftFanCurve').getContext('2d');
const leftFanCurve = new Chart(leftFanCtx, {
    type: 'line',
    data: {
        labels: Array.from({length: 15}, (_, i) => (i + 30) + Math.round(i * 4)),  // 30 - 95度
        datasets: [{
            label: 'CPU Fan Speed',
            data: Array(66).fill(50),  // 默认风扇速度
            borderColor: 'blue',
            fill: false,
            color: '#fff'
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true, text: 'Temperature (°C)',color: '#fff'
                },
                grid: { color: '#fff' },
                ticks: { color: '#fff' }
            },
            y: {
                title: {display: true, text: 'Fan Speed (%)',color: '#fff'}, 
                    min: 0, 
                    max: 100,
                    grid: { color: '#fff' },
                    ticks: { color: '#fff' }
                }
        },
        plugins: {
            dragData: {
                round: 0,
                onDrag: function (e, datasetIndex, index, value) {
                    console.log(`Left Fan - Temperature: ${leftFanCurve.data.labels[index]}, Speed: ${value}%`);
                }
            },
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: false
            }
        },
        cubicInterpolationMode: 'monotone'
    }
});

// 右风扇曲线
const rightFanCtx = document.getElementById('rightFanCurve').getContext('2d');
const rightFanCurve = new Chart(rightFanCtx, {
    type: 'line',
    data: {
        labels: Array.from({length: 15}, (_, i) => (i + 30) + Math.round(i * 4)),
        datasets: [{
            label: 'GPU Fan Speed',
            data: Array(66).fill(50),
            borderColor: 'green',
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                title: { display: true, text: 'Temperature (°C)', color: '#fff' },
                grid: { color: '#fff' },
                ticks: { color: '#fff' }
            },
            y: {
                title: { display: true, text: 'Fan Speed (%)', color: '#fff' }, 
                min: 0, 
                max: 100,
                grid: { color: '#fff' },
                ticks: { color: '#fff' }
            }
        },
        plugins: {
            dragData: {
                round: 0,
                onDrag: function (e, datasetIndex, index, value) {
                    console.log(`Right Fan - Temperature: ${rightFanCurve.data.labels[index]}, Speed: ${value}%`);
                }
            }
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'easeInBounce',
                from: 1,
                to: 0,
                loop: false
            }
        },
        cubicInterpolationMode: 'monotone'
    }
});

const leftFanSpeedCtx = document.getElementById('left_fan_speed').getContext('2d');
const rightFanSpeedCtx = document.getElementById('right_fan_speed').getContext('2d');

// 初始化风扇实时转速图表
function initSpeedCharts() {
    const leftFanSpeedChart = new Chart(leftFanSpeedCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 21}, (_, i) => i * 3),
            datasets: [{
                label: 'CPU Fan Speed',
                data: Array(21).fill(0),
                borderColor: 'blue',
                fill: false,
                color: '#fff'
            }, {
                label: 'GPU Fan Speed',
                data: Array(21).fill(0),
                borderColor: 'green',
                fill: false,
                color: '#fff'
            }]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'Time (s)', color: '#fff' },
                    grid: { color: '#fff' },
                    ticks: { color: '#fff' }
                },
                y: {
                    title: { display: true, text: 'Speed (RPM)', color: '#fff' }, 
                    min: 0, 
                    max: 6000,
                    grid: { color: '#fff' },
                    ticks: { color: '#fff' }
                }
            },
            pointStyle: false,
            cubicInterpolationMode: 'monotone'
        },
    });

    const rightFanSpeedChart = new Chart(rightFanSpeedCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 21}, (_, i) => i * 3),
            datasets: [{
                label: 'CPU Temperature',
                data: Array(21).fill(0),
                borderColor: 'blue',
                fill: false,
                color: '#fff'
            }, {
                label: 'GPU Temperature',
                data: Array(21).fill(0),
                borderColor: 'green',
                fill: false,
                color: '#fff'
            }]
        },
        options: {
            scales: {
                x: {
                    title: { display: true, text: 'Time (s)', color: '#fff' },
                    grid: { color: '#fff' },
                    ticks: { color: '#fff' }
                },
                y: {
                    title: { display: true, text: 'Temperature (℃)', color: '#fff' }, 
                    min: 0, 
                    max: 100,
                    grid: { color: '#fff' },
                    ticks: { color: '#fff' }
                }
            },
            pointStyle: false,
            cubicInterpolationMode: 'monotone'
        }
    });

    return {leftFanSpeedChart, rightFanSpeedChart};
}

// 更新风扇实时转速数据
function updateFanSpeeds(leftFanSpeedChart, rightFanSpeedChart, left_fan_speed, right_fan_speed, left_temp, right_temp) {
    if (left_fan_speed < 0 || right_fan_speed < 0 || left_fan_speed > 7000 || right_fan_speed > 7000 || left_temp < 0 || right_temp < 0 || left_temp > 100 || right_temp > 100) {
        return;
    }
    leftFanSpeedChart.data.datasets[0].data.push(left_fan_speed);
    leftFanSpeedChart.data.datasets[0].data.shift(); // 移除最早的数据
    leftFanSpeedChart.data.datasets[1].data.push(right_fan_speed);
    leftFanSpeedChart.data.datasets[1].data.shift();
    rightFanSpeedChart.data.datasets[0].data.push(left_temp);
    rightFanSpeedChart.data.datasets[0].data.shift();
    rightFanSpeedChart.data.datasets[1].data.push(right_temp);
    rightFanSpeedChart.data.datasets[1].data.shift();
    // console.log(`Left Fan - Speed: ${leftFanSpeedChart.data.datasets[0].data}, Right Fan - Speed: ${rightFanSpeedChart.data.datasets[0].data}`);
    leftFanSpeedChart.update();
    rightFanSpeedChart.update();
}

async function loadConfigData() {
    const fanData = await window.__TAURI__.core.invoke('load_fan_config');
    if (fanData) {
        // update left fan curve data
        leftFanCurve.data.datasets[0].data = fanData.left_fan.map(point => point.speed);
        leftFanCurve.update();

        // update right fan curve data
        rightFanCurve.data.datasets[0].data = fanData.right_fan.map(point => point.speed);
        rightFanCurve.update();
    } else {
        console.log('No config file found or read failed');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // const { leftFanCurve, rightFanCurve } = await initFanCurves();
    const {leftFanSpeedChart, rightFanSpeedChart} = initSpeedCharts();

    const startStopButton = document.getElementById('startStopButton');
    const saveConfigButton = document.getElementById('saveConfigButton');
    let isRunning = false;
    // await loadConfigData();
    // update fan speed data every 2.5 seconds

    // setInterval(async () => {
    //     // const speeds = await window.__TAURI__.core.invoke('get_fan_speeds');
    //     // updateFanSpeeds(leftFanSpeedChart, rightFanSpeedChart, speeds.left_fan_speed, speeds.right_fan_speed, speeds.left_temp, speeds.right_temp);
    // }, 2500);
    async function listen_to_greet() {
      await listen('get-fan-speeds', (speeds) => {
        // event.payload is the actual structure
        console.log(speeds.payload);
        updateFanSpeeds(leftFanSpeedChart, rightFanSpeedChart, speeds.payload.left_fan_speed, speeds.payload.right_fan_speed, speeds.payload.left_temp, speeds.payload.right_temp);
      });
    }
    await window.__TAURI__.core.invoke('get_fan_speeds');
    await listen_to_greet();
    // button click event
    startStopButton.addEventListener('click', () => {
        isRunning = !isRunning;
        if (isRunning) {
            startStopButton.querySelector('a').textContent = 'Stop';
            startStopButton.style.backgroundColor = 'rgb(255, 0, 0, 0.3)';
            startStopButton.classList.remove('stopped');

                // get data and pass to Rust
            const fanData = getFanCurveData();
            window.__TAURI__.core.invoke('start_fan_control', {fanData});
        } else {
            startStopButton.querySelector('a').textContent = 'Start';
            startStopButton.style.backgroundColor = 'rgb(255, 182, 193, 0.3)';
            startStopButton.classList.add('stopped');

            // stop fan control
            window.__TAURI__.core.invoke('stop_fan_control');
        }
    });
    // load config button
    const loadConfigButton = document.getElementById('loadConfigButton');
    loadConfigButton.addEventListener('click', async () => {
        await loadConfigData();
    });
    // save config button
    saveConfigButton.addEventListener('click', () => {
        const fanData = getFanCurveData();
        window.__TAURI__.core.invoke('save_fan_config', {fanData});
    });

    const autostartEnable = await window.__TAURI__.core.invoke('plugin:autostart|is_enabled');
    console.log(autostartEnable);
    if(autostartEnable) {
        console.log("auto start");
        // was commented
        // loadConfigData();
        loadConfigButton.click();
        startStopButton.click();
    }

});

// get all points and pass to Rust
function getFanCurveData() {
    const leftFanData = leftFanCurve.data.labels.map((temp, index) => {
        return {temperature: temp, speed: leftFanCurve.data.datasets[0].data[index]};
    });

    const rightFanData = rightFanCurve.data.labels.map((temp, index) => {
        return {temperature: temp, speed: rightFanCurve.data.datasets[0].data[index]};
    });

    return {left_fan: leftFanData, right_fan: rightFanData};
}