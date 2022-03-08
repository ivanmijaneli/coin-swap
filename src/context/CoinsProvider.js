import {createContext, useEffect, useState} from "react";

export const CoinsContext = createContext()

export default function CoinsProvider({ children }) {
    const [coinData, setCoinData] = useState({
        coins: [],
        baseCoin: null,
        targetCoin: null,
        baseAmount: '',
        targetAmount: '',
        amountInBaseCoin: true,
    })

    useEffect(() => {
        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=btc&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y`)
            .then(res => res.json())
            .then(coins => {
                console.log(coins)
                setCoinData(prevState => ({
                    ...prevState,
                    coins,
                    baseCoin: coins[0],
                    targetCoin: coins[1]
                }))
            })
    }, [])

    return(
        <CoinsContext.Provider value={{...coinData, setCoinData}}>
            {children}
        </CoinsContext.Provider>
    )
}