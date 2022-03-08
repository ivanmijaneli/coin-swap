import styles from './Charts.module.css'
import {useContext, useEffect, useState} from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {CoinsContext} from "../../context/CoinsProvider";

export default function Charts({ isOpen, onClose }) {
    const { baseCoin, targetCoin, baseAmount, targetAmount, setCoinData } = useContext(CoinsContext)

    const [days, setDays] = useState(7)
    const [history, setHistory] = useState([])

    let interval = 'hourly'
    if (days > 1) {
        interval = 'daily'
    }

    useEffect(() => {
        fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eth&days=${days}&interval=${interval}`)
            .then(res => res.json())
            .then(history => {
                console.log(history)
                setHistory(history.prices.map(([date, price], i) => {
                    date = new Date(date)
                    return {
                        time: interval === 'hourly' ?
                            date.toLocaleTimeString() :
                            date.toLocaleDateString('en-GB', {day: '2-digit' ,month: 'short'}),
                        price: price.toFixed(3)
                    }
                }))
            })
    }, [])

    if (!isOpen) return null

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.coins}>
                        <div className={styles.logos}>
                            <img className={styles.logo} src={baseCoin.image} alt={`${baseCoin.name} logo`} />
                            <img className={styles.logo} src={targetCoin.image} alt={`${targetCoin.name} logo`} />
                        </div>
                        <span className={styles.headerSymbols}>{baseCoin.symbol} / {targetCoin.symbol}</span>
                    </div>
                    <button>
                        <svg viewBox="0 0 24 25" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.86 4.86003L21.65 7.65003C21.84 7.84003 21.84 8.16003 21.64 8.35003L18.85 11.14C18.54 11.46 18 11.24 18 10.79V9.00003H4C3.45 9.00003 3 8.55003 3 8.00003C3 7.45003 3.45 7.00003 4 7.00003H18V5.21003C18 4.76003 18.54 4.54003 18.86 4.86003ZM5.14001 19.14L2.35001 16.35C2.16001 16.16 2.16001 15.84 2.36001 15.65L5.15001 12.86C5.46001 12.54 6.00001 12.76 6.00001 13.21V15H20C20.55 15 21 15.45 21 16C21 16.55 20.55 17 20 17H6.00001V18.79C6.00001 19.24 5.46001 19.46 5.14001 19.14Z"/>
                        </svg>
                    </button>
                </div>
                <button onClick={onClose}>
                    <svg viewBox="0 0 24 24" color="primary" width="20px" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"/>
                    </svg>
                </button>
            </div>
            <div className={styles.main}>
                <div className={styles.mainInfo}>
                    <div className={styles.price}>62.42 </div>
                    <div className={styles.mainSymbols}>{baseCoin.symbol} / {targetCoin.symbol} </div>
                    <div className={styles.percent}>+0.967 (1.54%)</div>
                </div>
                <div className={styles.time}>{new Date().toLocaleString()}</div>
                <div className={styles.tabs}>
                    <button className={styles.activeTab}>24H</button>
                    <button>1W</button>
                    <button>1M</button>
                    <button>1Y</button>
                </div>
            </div>
            <div className={styles.chart}>
                <ResponsiveContainer>
                    <AreaChart
                        data={history}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00E7B0" stopOpacity="0.34"/>
                                <stop offset="100%" stopColor="#0C8B6C" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <YAxis hide="hide" domain={['dataMin', 'dataMax']} />
                        <XAxis
                            dataKey="time"
                            ticks={history.slice(0, history.length - 1).map(h => h.time)}
                            axisLine={false}
                            tickLine={false}
                            tickCount={7}
                            dy={6}
                            allowDataOverflow={false}
                        />
                        <Tooltip />
                        <Area type="linea" dataKey="price" stroke="#31d0aa" strokeWidth="2px" fill="url(#colorUv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
