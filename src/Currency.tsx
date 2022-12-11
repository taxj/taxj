import {currencyPreview} from '~/src/lib'

export default function Currency({amount}: {amount: number}) {
	return <>{currencyPreview(amount)}</>
}
