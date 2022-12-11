// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
// earning = profit = revenue - expense
// 1,625,000円まで	550,000円
// 1,625,001円から	1,800,000円まで	収入金額×40％-100,000円
// 1,800,001円から	3,600,000円まで	収入金額×30％+80,000円
// 3,600,001円から	6,600,000円まで	収入金額×20％+440,000円
// 6,600,001円から	8,500,000円まで	収入金額×10％+1,100,000円
// 8,500,001円以上	1,950,000円（上限）
import {useCallback, useState} from 'react'

export const getEarningDeduction = (earning: number) =>
	earning <= 1_625_000
		? 550_000
		: earning <= 1_800_000
		? (earning * 40) / 100 - 100_000
		: earning <= 3_600_000
		? (earning * 30) / 100 + 80_000
		: earning <= 6_600_000
		? (earning * 20) / 100 + 440_000
		: earning <= 8_500_000
		? (earning * 10) / 100 + 1_100_000
		: 1_950_000

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
export const getBasicIncomeDeduction = deductedEarning => 380_000

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
export const getTaxRate = (deductedIncome: number) =>
	deductedIncome <= 1_949_000
		? 5 / 100
		: deductedIncome <= 3_299_000
		? 10 / 100
		: deductedIncome <= 6_949_000
		? 20 / 100
		: deductedIncome <= 8_999_000
		? 23 / 100
		: deductedIncome <= 17_999_000
		? 33 / 100
		: deductedIncome <= 39_999_000
		? 40 / 100
		: 45 / 100

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
export const getBasicTaxDeduction = (deductedIncome: number) =>
	deductedIncome <= 1_949_000
		? 0
		: deductedIncome <= 3_299_000
		? 97_500
		: deductedIncome <= 6_949_000
		? 427_500
		: deductedIncome <= 8_999_000
		? 636_000
		: deductedIncome <= 17_999_000
		? 1_536_000
		: deductedIncome <= 39_999_000
		? 2_796_000
		: 4_796_000

export const safeParseInt = (value: string, defaultVal = 0) => {
	const parsed = parseInt(value)
	return isNaN(parsed) || !isFinite(parsed) ? defaultVal : parsed
}

export const currencyPreview = (value: number) =>
	`¥${value.toLocaleString('ja-JP', {maximumFractionDigits: 0})}`

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm
export const getGeneralFamilyDependantDeduction = (count: number, income: number) =>
	count * (income <= 9_000_000 ? 380_000 : income <= 9_500_000 ? 260_000 : 130_000)

export const getElderFamilyDependantDeduction = (count: number, income: number) =>
	count * (income <= 9_000_000 ? 480_000 : income <= 9_500_000 ? 320_000 : 160_000)

export const thousandRound = (value: number) => Math.trunc(value / 1000) * 1000

export const useLocalStorageInt = (key: string, initialValue: any) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key)
			return item !== undefined ? safeParseInt(item, initialValue) : initialValue
		} catch (error) {
			console.error(error)
			return initialValue
		}
	})

	const setValue = useCallback(
		(value: any) => {
			try {
				setStoredValue(value)
				window.localStorage.setItem(key, JSON.stringify(value))
			} catch (error) {
				console.log(error)
			}
		},
		[key],
	)
	return [storedValue, setValue]
}
