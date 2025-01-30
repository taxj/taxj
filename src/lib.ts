// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
// earning = profit = revenue - expense
// 1,625,000円まで	550,000円
// 1,625,001円から	1,800,000円まで	収入金額×40％-100,000円
// 1,800,001円から	3,600,000円まで	収入金額×30％+80,000円
// 3,600,001円から	6,600,000円まで	収入金額×20％+440,000円
// 6,600,001円から	8,500,000円まで	収入金額×10％+1,100,000円
// 8,500,001円以上	1,950,000円（上限）
import {useCallback, useState} from 'react'

export function getSalaryDeduction(earning: number) {
	return earning <= 1_625_000
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
}

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
export function getBasicIncomeDeduction(deductedEarning: number) {
	return deductedEarning <= 24_000_000
		? 480_000
		: deductedEarning <= 24_500_000
			? 320_000
			: deductedEarning <= 25_000_000
				? 160_000
				: 0
}

const taxRateLevel = [
	[1_949_000, 5 / 100],
	[3_299_000, 10 / 100],
	[6_949_000, 20 / 100],
	[8_999_000, 23 / 100],
	[17_999_000, 33 / 100],
	[39_999_000, 40 / 100],
	[Infinity, 45 / 100],
] as const

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
export function getTaxRate(deductedIncome: number) {
	const [limit, rate] = taxRateLevel.find(([limit]) => deductedIncome <= limit)
	return rate
}

export function getNearbyTaxRates(deductedIncome: number) {
	const idx = taxRateLevel.findIndex(([limit]) => deductedIncome <= limit)
	return {
		previous: taxRateLevel[idx - 1],
		current: taxRateLevel[idx],
		next: taxRateLevel[idx + 1],
	}
}

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
export function getBasicTaxDeduction(deductedIncome: number) {
	return deductedIncome <= 1_949_000
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
}

export function safeParseInt(value: string, defaultVal = 0) {
	const parsed = parseInt((value ?? '').replace(/[_,]/g, ''))
	return isNaN(parsed) || !isFinite(parsed) ? defaultVal : parsed
}

export function Currency({amount}: {amount: number}) {
	return `¥${amount.toLocaleString('ja-JP', {maximumFractionDigits: 0})}`
}

// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm
export function getGeneralFamilyDependantDeduction(count: number, income: number) {
	return count * (income <= 9_000_000 ? 380_000 : income <= 9_500_000 ? 260_000 : 130_000)
}

export function getElderFamilyDependantDeduction(count: number, income: number) {
	return count * (income <= 9_000_000 ? 480_000 : income <= 9_500_000 ? 320_000 : 160_000)
}

export function thousandRound(value: number) {
	return Math.trunc(value / 1000) * 1000
}

export function useLocalStorage(key: string, initialValue: string) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			return window.localStorage.getItem(key) ?? initialValue
		} catch (error) {
			console.error(error)
			return initialValue
		}
	})

	const setValue = useCallback(
		(value = '') => {
			try {
				setStoredValue(value)
				window.localStorage.setItem(key, value)
			} catch (error) {
				console.log(error)
			}
		},
		[key],
	)
	return [storedValue, setValue] as const
}

const insuranceDeductionTable = [
	[58_000, 63_000],
	[68_000, 73_000],
	[78_000, 83_000],
	[88_000, 93_000],
	[98_000, 101_000],
	[104_000, 107_000],
	[110_000, 114_000],
	[118_000, 122_000],
	[126_000, 130_000],
	[134_000, 138_000],
	[142_000, 146_000],
	[150_000, 155_000],
	[160_000, 165_000],
	[170_000, 175_000],
	[180_000, 185_000],
	[190_000, 195_000],
	[200_000, 210_000],
	[220_000, 230_000],
	[240_000, 250_000],
	[260_000, 270_000],
	[280_000, 290_000],
	[300_000, 310_000],
	[320_000, 330_000],
	[340_000, 350_000],
	[360_000, 370_000],
	[380_000, 395_000],
	[410_000, 425_000],
	[440_000, 455_000],
	[470_000, 485_000],
	[500_000, 515_000],
	[530_000, 545_000],
	[560_000, 575_000],
	[590_000, 605_000],
	[620_000, 635_000],
	[650_000, 665_000],
	[680_000, 695_000],
	[710_000, 730_000],
	[750_000, 770_000],
	[790_000, 810_000],
	[830_000, 855_000],
	[880_000, 905_000],
	[930_000, 955_000],
	[980_000, 1_005_000],
	[1_030_000, 1_055_000],
	[1_090_000, 1_115_000],
	[1_150_000, 1_175_000],
	[1_210_000, 1_235_000],
	[1_270_000, 1_295_000],
	[1_330_000, 1_355_000],
	[1_390_000, null],
] as const

// https://www.kyoukaikenpo.or.jp/g7/cat330/
const insuranceRate = 9.98 / 100
const insuranceRateForOld = 11.58 / 100
const welfarePenaltyRate = 18.3 / 100

// before deduction
export function getHealthInsuranceDeduction(monthlyIncome: number, isMoreThan40YO: boolean) {
	for (const [avg, max] of insuranceDeductionTable) {
		if (max === null || monthlyIncome < max)
			return ((avg * (isMoreThan40YO ? insuranceRateForOld : insuranceRate)) / 2) * 12
	}
	return 0
}

// before deduction
export function getWelfarePensionInsuranceDeduction(monthlyIncome: number) {
	for (const [avg, max] of insuranceDeductionTable) {
		if (max === null || monthlyIncome < max) return ((avg * welfarePenaltyRate) / 2) * 12
	}
	return 0
}
