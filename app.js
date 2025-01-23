const BASE_URL = window.location.hostname === 'localhost' 
  ? '' 
  : '/.netlify/functions/server';

document.addEventListener('DOMContentLoaded', function () {
    const stockSymbols = [
        "ACLBSL", "ADBL", "AHL", "AHPC", "AKJCL", "AKPL", "ALBSL", "ALICL", "ALICLP", "ANLB",
        "API", "AVYAN", "BARUN", "BBC", "BEDC", "BFC", "BGWT", "BHDC", "BHL", "BHPL", "BNHC",
        "BNL", "BNT", "BPCL", "C30MF", "CBBL", "CBLD88", "CCBD88", "CFCL", "CGH", "CHCL", "CHDC",
        "CHL", "CIT", "CITY", "CKHL", "CLI", "CMF1", "CMF2", "CORBL", "CYCL", "CZBIL", "DDBL",
        "DHPL", "DLBS", "DOLTI", "DORDI", "EBL", "EBLD86", "EDBL", "EHPL", "ENL", "FMDBL", "FOWAD",
        "GBBD85", "GBBL", "GBIME", "GBLBS", "GCIL", "GFCL", "GHL", "GIBF1", "GILB", "GLBSL", "GLH",
        "GMFBS", "GMFIL", "GRDBL", "GUFL", "GVL", "H8020", "HATHY", "HBL", "HDHPC", "HDL", "HEI",
        "HEIP", "HHL", "HIDCL", "HIDCLP", "HLBSL", "HLI", "HPPL", "HRL", "HURJA", "ICFC", "IGI",
        "IHL", "ILBS", "ILI", "JBBD87", "JBBL", "JBLB", "JFL", "JOSHI", "JSLBB", "KBL", "KBLD86",
        "KBLD89", "KBSH", "KDBY", "KDL", "KEF", "KKHC", "KMCDB", "KPCL", "KSBBL", "KSY", "LBBL",
        "LEC", "LICN", "LLBS", "LSL", "LUK", "LVF2", "MAKAR", "MANDU", "MATRI", "MBJC", "MBL",
        "MBLD87", "MCHL", "MDB", "MEHL", "MEL", "MEN", "MERO", "MFIL", "MHCL", "MHL", "MHNL", "MKCL",
        "MKHC", "MKHL", "MKJC", "MLBBL", "MLBL", "MLBLD89", "MLBS", "MLBSL", "MMF1", "MMKJL", "MNBBL",
        "MPFL", "MSHL", "MSLB", "NABBC", "NABIL", "NADEP", "NBF2", "NBF3", "NBL", "NBLD82", "NESDO",
        "NFS", "NGPL", "NHDL", "NHPC", "NIBLGF", "NIBLSTF", "NIBSF2", "NICA", "NICAD8182", "NICAD8283",
        "NICBF", "NICFC", "NICGF", "NICGF2", "NICL", "NICLBSL", "NICSF", "NIFRA", "NIL", "NIMB",
        "NIMBPO", "NLG", "NLIC", "NLICL", "NMB", "NMB50", "NMBD87/88", "NMBD89/90", "NMBMF", "NMFBS",
        "NMLBBL", "NRIC", "NRM", "NRN", "NSIF2", "NTC", "NUBL", "NWCL", "NYADI", "OHL", "PBD88",
        "PBLD86", "PCBL", "PFL", "PHCL", "PMHPL", "PMLI", "PMLIP", "PPCL", "PPL", "PRIN", "PROFL",
        "PRSF", "PRVU", "PSF", "RADHI", "RAWA", "RBCL", "RBCLPO", "RFPL", "RHGCL", "RHPL", "RIDI",
        "RLFL", "RMF1", "RMF2", "RNLI", "RSDC", "RURU", "SADBL", "SAGF", "SAHAS", "SALICO", "SAMAJ",
        "SANIMA", "SAPDBL", "SARBTM", "SBCF", "SBD87", "SBI", "SBID83", "SBID89", "SBL", "SBLD2082",
        "SCB", "SDBD87", "SEF", "SFCL", "SFEF", "SFMF", "SGHC", "SGIC", "SHEL", "SHINE", "SHIVM",
        "SHL", "SHLB", "SHPC", "SICL", "SIFC", "SIGS2", "SIGS3", "SIKLES", "SINDU", "SJCL", "SJLIC",
        "SKBBL", "SLBBL", "SLBSL", "SLCF", "SMATA", "SMB", "SMFBS", "SMH", "SMHL", "SMJC", "SMPDA",
        "SNLI", "SONA", "SPC", "SPDL", "SPHL", "SPIL", "SPL", "SRLI", "SSHL", "STC", "SWBBL", "SWMF",
        "TAMOR", "TPC", "TRH", "TSHL", "TVCL", "UAIL", "UHEWA", "ULBSL", "ULHC", "UMHL", "UMRH",
        "UNHPL", "UNL", "UNLB", "UPCL", "UPPER", "USHEC", "USHL", "USLB", "VLBS", "VLUCL", "WNLB","Finance_index","Hydropower_index","Development%20Bank_index","Nepse_index"
    ];
    let currentStockIndex = 0;
    let consolidationDays = 20;
    let consolidationRange = 10;

    let consolidationPriceLines = {}; // Global object to store price lines
    const timeframeColors = {
        20: '#2962FF',  // Blue
        50: '#00C853',  // Green
        90: '#FF6D00',  // Orange
        200: '#D50000'  // Red
    };
    const timeframeLineWidths = {
        20: 1,
        50: 2,
        90: 3,
        200: 4
    };


    let priceChart = LightweightCharts.createChart(document.getElementById('chart'), {
        width: document.getElementById('chart').clientWidth,
        height: document.getElementById('chart').clientHeight,
        layout: {
            backgroundColor: '#ffffff',
            textColor: '#333',
        },
        grid: {
            vertLines: {
                color: '#e1ecf1',
            },
            horzLines: {
                color: '#e1ecf1',
            },
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
            rightOffset: 10,
            barSpacing: 8,
            fixLeftEdge: true,
            lockVisibleTimeRangeOnResize: true,
            rightBarStaysOnScroll: true,
            alignLabels: true,
            visible: true,
            minBarSpacing: 4,
        },
        rightPriceScale: {
            autoScale: true,
            scaleMargins: {
                top: 0.1,
                bottom: 0.1
            },
        },
    });

    let volumeChart = LightweightCharts.createChart(document.getElementById('volumeChart'), {
        width: document.getElementById('volumeChart').clientWidth,
        height: document.getElementById('volumeChart').clientHeight,
        layout: {
            backgroundColor: '#ffffff',
            textColor: '#333',
        },
        grid: {
            vertLines: {
                color: '#e1ecf1',
            },
            horzLines: {
                color: '#e1ecf1',
            },
        },
        timeScale: {
            rightOffset: 30,
            barSpacing: 20,
            alignLabels: true,
        },
    });

    let candleSeries = priceChart.addCandlestickSeries();
    let volumeSeries = volumeChart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
            top: 0.1,
            bottom: 0.9,
        },
    });

    const DEBUG = true; // Toggle debug mode

    function validateData(data, type = 'OHLC') {
        if (!DEBUG) return true;

        console.group(`Data Validation (${type})`);
        let isValid = true;

        try {
            // Check if data is array
            if (!Array.isArray(data)) {
                console.error('Data is not an array');
                return false;
            }

            // Check for empty array
            if (data.length === 0) {
                console.error('Data array is empty');
                return false;
            }

            // Check time ordering
            for (let i = 1; i < data.length; i++) {
                const prevTime = new Date(data[i - 1].time);
                const currTime = new Date(data[i].time);

                if (prevTime >= currTime) {
                    console.error('Time ordering error:', {
                        index: i,
                        prevTime: data[i - 1].time,
                        currTime: data[i].time
                    });
                    isValid = false;
                }
            }

            // Check for valid values
            data.forEach((item, index) => {
                // Check time format
                if (!/^\d{4}-\d{2}-\d{2}$/.test(item.time)) {
                    console.error('Invalid date format at index', index, item.time);
                    isValid = false;
                }

                if (type === 'OHLC') {
                    // Check OHLC values
                    ['open', 'high', 'low', 'close'].forEach(prop => {
                        if (typeof item[prop] !== 'number' || isNaN(item[prop])) {
                            console.error(`Invalid ${prop} value at index`, index, item[prop]);
                            isValid = false;
                        }
                    });

                    // Check price relationships
                    if (item.high < item.low ||
                        item.high < item.open ||
                        item.high < item.close ||
                        item.low > item.open ||
                        item.low > item.close) {
                        console.error('Invalid price relationships at index', index, item);
                        isValid = false;
                    }
                } else if (type === 'Volume') {
                    // Check volume values
                    if (typeof item.value !== 'number' || isNaN(item.value) || item.value <= 0) {
                        console.error('Invalid volume value at index', index, item.value);
                        isValid = false;
                    }
                    // Check color value
                    if (typeof item.color !== 'string' || !item.color.startsWith('#')) {
                        console.error('Invalid color value at index', index, item.color);
                        isValid = false;
                    }
                }
            });

            // Log validation result
            if (isValid) {
                console.log(`✅ ${type} data validation passed (${data.length} points)`);
            } else {
                console.error(`❌ ${type} data validation failed`);
            }

        } catch (error) {
            console.error('Validation error:', error);
            isValid = false;
        }

        console.groupEnd();
        return isValid;
    }

    function findConsolidationLevels(data, days = 2, priceRangePercent = 30) {
        if (data.length < days) return null;

        // Get the specified period of data
        const periodData = data.slice(-days);

        // Calculate price statistics
        const highPrices = periodData.map(d => d.high);
        const lowPrices = periodData.map(d => d.low);
        const maxPrice = Math.max(...highPrices);
        const minPrice = Math.min(...lowPrices);

        // Calculate price range as a percentage
        const priceRange = ((maxPrice - minPrice) / minPrice) * 100;

        // If price range is within our threshold, we have a consolidation
        if (priceRange <= priceRangePercent) {
            // Find significant levels within consolidation
            const levels = findSignificantPriceLevels(periodData);
            return {
                isConsolidating: true,
                range: priceRange,
                levels: levels,
                period: days
            };
        }

        return {
            isConsolidating: false,
            range: priceRange,
            levels: null,
            period: days
        };
    }

    function findSignificantPriceLevels(data) {
        // Initialize arrays to store price touches
        const pricePoints = [];

        // Collect all highs and lows
        data.forEach(candle => {
            pricePoints.push({
                price: candle.high,
                type: 'high',
                time: candle.time
            });
            pricePoints.push({
                price: candle.low,
                type: 'low',
                time: candle.time
            });
        });

        // Group similar price levels (within 0.5% range)
        const groupedLevels = groupSimilarPriceLevels(pricePoints);

        // Sort levels by touch count in descending order
        const sortedLevels = Object.entries(groupedLevels)
            .sort(([, a], [, b]) => b.touches - a.touches)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});

        return sortedLevels;
    }

    function groupSimilarPriceLevels(pricePoints, tolerancePercent = 0.005) {
        const levels = {};

        pricePoints.forEach(point => {
            let levelFound = false;
            for (const priceLevel in levels) {
                if (isWithinTolerance(point.price, parseFloat(priceLevel), tolerancePercent)) {
                    levels[priceLevel].touches++;
                    levels[priceLevel].points.push(point);
                    levelFound = true;
                    break;
                }
            }
            if (!levelFound) {
                levels[point.price.toFixed(2)] = {
                    price: point.price.toFixed(2),
                    touches: 1,
                    points: [point]
                };
            }
        });
        return levels;
    }

    function isWithinTolerance(price1, price2, tolerancePercent) {
        const tolerance = Math.abs(price2 * tolerancePercent);
        return Math.abs(price1 - price2) <= tolerance;
    }

    function findRecentConsolidation(data, lookbackDays) {
        if (!data || data.length < lookbackDays) return null;

        const recentData = data.slice(-lookbackDays);
        if (!recentData.length) return null;

        const highPrices = recentData.map(d => d.high).filter(h => h != null && !isNaN(h));
        const lowPrices = recentData.map(d => d.low).filter(l => l != null && !isNaN(l));

        if (!highPrices.length || !lowPrices.length) return null;

        const maxPrice = Math.max(...highPrices);
        const minPrice = Math.min(...lowPrices);
        const midPrice = (maxPrice + minPrice) / 2;

        // **Check for breakout on the latest candle**
        const latestClosePrice = data[data.length - 1].close;
        const crossedAbove = latestClosePrice > maxPrice; // Check if closed above top line

        return {
            isConsolidating: true,
            range: ((maxPrice - minPrice) / minPrice) * 100,
            levels: null, // You can add level finding logic here if needed in future
            period: lookbackDays,
            topPrice: maxPrice,
            bottomPrice: minPrice,
            crossedAboveLine: crossedAbove // Add this to indicate breakout
        };
    }

    function drawConsolidationBox(candleSeries, consolidation, data, timeframe) {
        if (!consolidation) {
            console.warn(`No consolidation found for ${timeframe}D timeframe.`);
            return;
        }

        console.log(`drawConsolidationBox called for timeframe: ${timeframe}D`);
        const color = timeframeColors[timeframe];
        const lineWidth = timeframeLineWidths[timeframe];
        console.log(`Color for ${timeframe}D: ${color}, Line Width: ${lineWidth}`);

        const lines = []; // Array to hold lines for this timeframe

        // Top line
        const topLine = candleSeries.createPriceLine({
            price: consolidation.topPrice,
            color: color,
            lineWidth: lineWidth,
            lineStyle: LightweightCharts.LineStyle.Solid,
            axisLabelVisible: true,
            // title: `${timeframe}D Top`, // Removed title
        });
        lines.push(topLine); // Add to lines array

        // Bottom line
        const bottomLine = candleSeries.createPriceLine({
            price: consolidation.bottomPrice,
            color: color,
            lineWidth: lineWidth,
            lineStyle: LightweightCharts.LineStyle.Solid,
            axisLabelVisible: true,
            // title: `${timeframe}D Bottom`, // Removed title
        });
        lines.push(bottomLine); // Add to lines array


        // Store lines in the global object, keyed by timeframe
        consolidationPriceLines[timeframe] = lines;

        console.log(`Drawing ${timeframe}D levels in color: ${color}, Width: ${lineWidth}`);
    }

    function highlightLineIntersections() {
        const timeframes = Object.keys(consolidationPriceLines);
        const tolerancePercent = 0.005; // 0.5% price tolerance

        for (let i = 0; i < timeframes.length; i++) {
            for (let j = i + 1; j < timeframes.length; j++) {
                const timeframe1 = timeframes[i];
                const timeframe2 = timeframes[j];
                const lines1 = consolidationPriceLines[timeframe1];
                const lines2 = consolidationPriceLines[timeframe2];

                if (!lines1 || !lines2) continue; // Skip if lines are not available

                lines1.forEach(line1 => {
                    lines2.forEach(line2 => {
                        const price1 = line1.options().price;
                        const price2 = line2.options().price;
                        const priceDiffPercent = Math.abs((price1 - price2) / price1);

                        if (priceDiffPercent <= tolerancePercent) {
                            console.log(`Intersection detected between ${timeframe1}D and ${timeframe2}D lines at price: ${price1}`);
                            line1.applyOptions({ color: '#000000' }); // Make line black
                            line2.applyOptions({ color: '#000000' }); // Make line black
                        }
                    });
                });
            }
        }
    }


    function processData(csvData, symbol) {
        try {
            const lines = csvData.split('\n');
            const uniqueDataMap = new Map();
            let headerFound = false;

            // Filter for data from 2019 onwards
            const startDate = new Date('2019-01-01');

            // First pass - collect and validate data
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const columns = line.split(',');
                if (columns.length >= 7) {
                    if (!headerFound && columns[0].toLowerCase().includes('date')) {
                        headerFound = true;
                        continue;
                    }

                    if (headerFound) {
                        const [dateStr, stockSymbol, open, high, low, close, volume] = columns;

                        // Skip if not the requested symbol
                        if (stockSymbol !== symbol) continue;

                        // Skip invalid data
                        if (!dateStr || !open || !high || !low || !close || !volume) {
                            continue;
                        }

                        const dateObj = new Date(dateStr);
                        if (isNaN(dateObj.getTime())) continue;

                        // Skip data before 2019
                        if (dateObj < startDate) continue;

                        // Parse numeric values
                        const numOpen = parseFloat(open);
                        const numHigh = parseFloat(high);
                        const numLow = parseFloat(low);
                        const numClose = parseFloat(close);
                        const numVolume = parseFloat(volume);

                        // Skip if any value is NaN, null, or 0
                        if (isNaN(numOpen) || isNaN(numHigh) || isNaN(numLow) ||
                            isNaN(numClose) || isNaN(numVolume) ||
                            numOpen === 0 || numHigh === 0 || numLow === 0 ||
                            numClose === 0 || numVolume === 0) {
                            continue;
                        }

                        // Validate price relationships
                        if (numHigh < numLow || numHigh < numOpen || numHigh < numClose ||
                            numLow > numOpen || numLow > numClose) {
                            continue;
                        }

                        // Format date consistently - ensure UTC
                        const formattedDate = dateObj.toISOString().split('T')[0];

                        // Store data with timestamp as key, handling duplicates by keeping higher volume
                        const existingData = uniqueDataMap.get(formattedDate);
                        if (!existingData || numVolume > existingData.value) {
                            uniqueDataMap.set(formattedDate, {
                                time: formattedDate, // Use YYYY-MM-DD format
                                open: Number(numOpen.toFixed(2)),
                                high: Number(numHigh.toFixed(2)),
                                low: Number(numLow.toFixed(2)),
                                close: Number(numClose.toFixed(2)),
                                value: Number(numVolume.toFixed(0))  // For volume chart
                            });
                        }
                    }
                }
            }

            if (uniqueDataMap.size === 0) {
                throw new Error(`No valid data found for ${symbol} from 2019 onwards`);
            }

            // Convert to array and ensure strict ascending order by date
            const sortedData = Array.from(uniqueDataMap.values()).sort((a, b) => {
                const dateA = new Date(a.time);
                const dateB = new Date(b.time);
                return dateA.getTime() - dateB.getTime();
            });

            // Verify strict ascending order
            for (let i = 1; i < sortedData.length; i++) {
                const prevDate = new Date(sortedData[i - 1].time);
                const currDate = new Date(sortedData[i].time);
                if (prevDate >= currDate) {
                    console.error('Time ordering violation:', {
                        prev: sortedData[i - 1],
                        curr: sortedData[i]
                    });
                    throw new Error('Data must be in strict ascending order by time');
                }
            }

            console.log(`Processed ${sortedData.length} valid data points for ${symbol}`);

            return {
                ohlc: sortedData.map(d => ({
                    time: d.time,
                    open: d.open,
                    high: d.high,
                    low: d.low,
                    close: d.close
                })),
                volume: sortedData.map(d => ({
                    time: d.time,
                    value: d.value,
                    color: d.close >= d.open ? '#26a69a' : '#ef5350'
                }))
            };

        } catch (error) {
            console.error('Data processing error:', error);
            throw new Error(`Failed to process data for ${symbol}: ${error.message}`);
        }
    }

    // Initialize the datalist with stock symbols
    const datalist = document.getElementById('stockList');
    stockSymbols.forEach(symbol => {
        const option = document.createElement('option');
        option.value = symbol;
        datalist.appendChild(option);
    });

    // Add input event listener for manual symbol entry
    document.getElementById('stockInput').addEventListener('change', function () {
        loadStockData();
    });

    async function updateBreakoutStocksList() {
        const breakoutStocksUl = document.getElementById('breakoutStocksUl');
        breakoutStocksUl.innerHTML = '<li>Loading breakout stocks...</li>'; // Indicate loading

        const loadedData = loadBreakoutStocksFromFile(); // Try to load from file

        let breakoutData;

        if (loadedData) {
            breakoutData = loadedData; // Use loaded data if available
        } else {
            breakoutData = await findBreakoutStocks(); // Calculate if no file data
            saveBreakoutStocksToFile(breakoutData); // Save the newly calculated data
        }

        const { breakoutStocks, nearBreakoutStocks1Percent, nearBreakoutStocks5Percent, justBrokeOutStocks } = breakoutData;


        breakoutStocksUl.innerHTML = ''; // Clear the "Loading..." message
        let hasBreakouts = false;
        const nearBreakoutFilter = document.querySelector('input[name="nearBreakoutFilter"]:checked').value;

        // Display Breakout Stocks First (General Breakouts - already crossed line)
        for (const timeframe in breakoutStocks) {
            const stocksForTimeframe = breakoutStocks[timeframe];
            if (stocksForTimeframe.length > 0) {
                hasBreakouts = true;
                const timeframeHeader = document.createElement('h3');
                timeframeHeader.textContent = `${timeframe}D Breakouts (Sustained)`;
                breakoutStocksUl.appendChild(timeframeHeader);
                const stocksList = createStockList(stocksForTimeframe);
                breakoutStocksUl.appendChild(stocksList);
            }
        }

        if (nearBreakoutFilter === 'breakout') {
            // Display 'Just Broke Out' Stocks (crossed line TODAY)
            for (const timeframe in justBrokeOutStocks) {
                const stocksForTimeframe = justBrokeOutStocks[timeframe];
                if (stocksForTimeframe.length > 0) {
                    hasBreakouts = true;
                    const timeframeHeader = document.createElement('h3');
                    timeframeHeader.textContent = `${timeframe}D Just Broke Out Today`;
                    breakoutStocksUl.appendChild(timeframeHeader);
                    const stocksList = createStockList(stocksForTimeframe);
                    breakoutStocksUl.appendChild(stocksList);
                }
            }
        }


        if (nearBreakoutFilter === '1%' || nearBreakoutFilter === 'all') {
            // Display Near Breakout Stocks (Within 1%)
            for (const timeframe in nearBreakoutStocks1Percent) {
                const stocksForTimeframe = nearBreakoutStocks1Percent[timeframe];
                if (stocksForTimeframe.length > 0) {
                    hasBreakouts = true;
                    const timeframeHeader = document.createElement('h3');
                    timeframeHeader.textContent = `${timeframe}D Stocks Near Breakout (Within 1%)`;
                    breakoutStocksUl.appendChild(timeframeHeader);
                    const stocksList = createStockList(stocksForTimeframe);
                    breakoutStocksUl.appendChild(stocksList);
                }
            }
        }


        if (nearBreakoutFilter === '5%' || nearBreakoutFilter === 'all') {
            // Display Near Breakout Stocks (Within 5%)
            for (const timeframe in nearBreakoutStocks5Percent) {
                const stocksForTimeframe = nearBreakoutStocks5Percent[timeframe];
                if (stocksForTimeframe.length > 0) {
                    hasBreakouts = true;
                    const timeframeHeader = document.createElement('h3');
                    timeframeHeader.textContent = `${timeframe}D Stocks Near Breakout (Within 5%)`;
                    breakoutStocksUl.appendChild(timeframeHeader);
                    const stocksList = createStockList(stocksForTimeframe);
                    breakoutStocksUl.appendChild(stocksList);
                }
            }
        }


        if (!hasBreakouts && nearBreakoutFilter !== 'none' && nearBreakoutFilter !== 'breakout') {
            const noBreakoutsItem = document.createElement('li');
            noBreakoutsItem.textContent = 'No breakouts or near breakouts detected today.';
            breakoutStocksUl.appendChild(noBreakoutsItem);
        } else if (!hasBreakouts && (nearBreakoutFilter === 'none' || nearBreakoutFilter === 'breakout')) {
            const noBreakoutsItem = document.createElement('li');
            noBreakoutsItem.textContent = 'No breakouts detected today.';
            breakoutStocksUl.appendChild(noBreakoutsItem);
        }
    }

    // Helper function to save breakout stocks data to localStorage (simulating file)
    function saveBreakoutStocksToFile(data) {
        const today = new Date().toISOString().split('T')[0];
        const filename = `breakout_stocks_${today}.txt`;
        localStorage.setItem(filename, JSON.stringify(data));
        console.log(`Breakout stocks saved to ${filename} (localStorage)`);
    }

    // Helper function to load breakout stocks data from localStorage (simulating file)
    function loadBreakoutStocksFromFile() {
        const today = new Date().toISOString().split('T')[0];
        const filename = `breakout_stocks_${today}.txt`;
        const storedData = localStorage.getItem(filename);
        if (storedData) {
            console.log(`Breakout stocks loaded from ${filename} (localStorage)`);
            return JSON.parse(storedData);
        }
        return null; // No data found for today
    }

    // Helper function to create stock list (reused code)
    function createStockList(stocks) {
        const stocksList = document.createElement('ul');
        stocks.forEach(symbol => {
            const listItem = document.createElement('li');
            listItem.textContent = symbol;
            listItem.onclick = () => {
                document.getElementById('stockInput').value = symbol;
                loadStockData();
            };
            stocksList.appendChild(listItem);
        });
        return stocksList;
    }

    function loadStockData() {
        const selectedSymbol = document.getElementById('stockInput').value.toUpperCase() || stockSymbols[currentStockIndex];
        document.getElementById('stockInput').value = selectedSymbol;

        document.getElementById('status').textContent = 'Fetching data...';

        // Clear existing data and price lines
        Object.values(consolidationPriceLines).forEach(lines => {
            lines.forEach(line => {
                try {
                    candleSeries.removePriceLine(line);
                } catch (e) { }
            });
        });
        consolidationPriceLines = {};
        candleSeries.setData([]);
        volumeSeries.setData([]);

        fetch(BASE_URL + '/dataset.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(csvData => {
                document.getElementById('status').textContent = 'Processing data...';

                try {
                    if (!csvData || csvData.trim().length === 0) {
                        throw new Error('Empty dataset');
                    }

                    const { ohlc, volume } = processData(csvData, selectedSymbol);

                    if (!ohlc || ohlc.length === 0) {
                        throw new Error('No valid data found for ' + selectedSymbol);
                    }

                    // Add validation in debug mode
                    if (DEBUG) {
                        const isOHLCValid = validateData(ohlc, 'OHLC');
                        const isVolumeValid = validateData(volume, 'Volume');

                        if (!isOHLCValid || !isVolumeValid) {
                            throw new Error('Data validation failed - check console for details');
                        }
                    }

                    // Set the data
                    candleSeries.setData(ohlc);
                    volumeSeries.setData(volume);

                    document.getElementById('status').textContent =
                        `Data loaded successfully! (${ohlc.length} points)`;

                    // **Draw all timeframes on load**
                    const candleData = candleSeries.data();
                    if (candleData && candleData.length > 0) {
                        [20, 50, 90, 200].forEach(timeframe => {
                            const consolidation = findRecentConsolidation(candleData, timeframe);
                            drawConsolidationBox(candleSeries, consolidation, candleData, timeframe);
                        });
                    }

                    // **Highlight line intersections AFTER drawing all lines**
                    highlightLineIntersections();


                    priceChart.timeScale().fitContent();
                    volumeChart.timeScale().fitContent();

                } catch (error) {
                    console.error(`Error processing ${selectedSymbol}:`, error);
                    document.getElementById('status').textContent = `Error: ${error.message}`;
                    throw error;
                }
            })
            .catch(error => {
                console.error('Error loading dataset:', error);
                document.getElementById('status').textContent = `Error: ${error.message}`;
                alert('Error loading dataset: ' + error.message);
            });
    }

    function changeStock(direction) {
        // Update the current stock index
        currentStockIndex += direction;
        if (currentStockIndex >= stockSymbols.length) currentStockIndex = 0;
        if (currentStockIndex < 0) currentStockIndex = stockSymbols.length - 1;

        // Save the current stock index to localStorage
        localStorage.setItem('currentStockIndex', currentStockIndex);

        // Reload the page to refresh the chart
        location.reload();
    }


    // Add event listeners to the buttons
    document.getElementById('prevButton').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior
        changeStock(-1);
    });

    document.getElementById('nextButton').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default behavior
        changeStock(1);
    });

    // Make functions available globally
    window.loadStockData = loadStockData;
    window.changeStock = changeStock;

    // On page load, retrieve the current stock index from localStorage
    const savedIndex = localStorage.getItem('currentStockIndex');
    if (savedIndex !== null) {
        currentStockIndex = parseInt(savedIndex, 10);
    }

    // Load the stock data for the saved index - this will now draw all levels on initial load
    loadStockData();

    // **Initial call to update breakout stocks list on page load**
    updateBreakoutStocksList();

    async function findBreakoutStocks() {
        const breakoutStocks = {};
        const nearBreakoutStocks1Percent = {};
        const nearBreakoutStocks5Percent = {};
        const justBrokeOutStocks = {};
        const nearBreakoutPercentage1Percent = 0.01;
        const nearBreakoutPercentage5Percent = 0.05;


        for (const symbol of stockSymbols) {
            try {
                const csvData = await fetchDataset();
                const { ohlc } = processData(csvData, symbol);
                if (!ohlc || ohlc.length === 0) continue;

                [20, 50, 90, 200].forEach(timeframe => {
                    const consolidation = findRecentConsolidation(ohlc, timeframe);
                    if (consolidation) {
                        if (consolidation.crossedAboveLine) {
                            if (!breakoutStocks[timeframe]) {
                                breakoutStocks[timeframe] = [];
                            }
                            breakoutStocks[timeframe].push(symbol);
                        } else {
                            // Check for 'Just Broke Out' - crossed above line today
                            if (consolidation.crossedAboveLine) {
                                if (!justBrokeOutStocks[timeframe]) {
                                    justBrokeOutStocks[timeframe] = [];
                                }
                                justBrokeOutStocks[timeframe].push(symbol);
                            } else {
                                // Near breakout checks (1% and 5%) - existing logic
                                let percentageAwayFromBreakout = (consolidation.topPrice - ohlc[ohlc.length - 1].close) / consolidation.topPrice;
                                if (percentageAwayFromBreakout > 0 && percentageAwayFromBreakout <= nearBreakoutPercentage1Percent) {
                                    if (!nearBreakoutStocks1Percent[timeframe]) {
                                        nearBreakoutStocks1Percent[timeframe] = [];
                                    }
                                    nearBreakoutStocks1Percent[timeframe].push(symbol);
                                } else if (percentageAwayFromBreakout > 0 && percentageAwayFromBreakout <= nearBreakoutPercentage5Percent) {
                                    if (!nearBreakoutStocks5Percent[timeframe]) {
                                        nearBreakoutStocks5Percent[timeframe] = [];
                                    }
                                    nearBreakoutStocks5Percent[timeframe].push(symbol);
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error(`Error checking breakouts for ${symbol}:`, error);
            }
        }
        return { breakoutStocks, nearBreakoutStocks1Percent, nearBreakoutStocks5Percent, justBrokeOutStocks };
    }

    async function fetchDataset() {
        const response = await fetch(BASE_URL + '/dataset.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    }
}); 