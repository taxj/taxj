import {currencyPreview} from './lib'

export default function Currency({amount}: {amount: number}) {
	return <>{currencyPreview(amount)}</>
}
