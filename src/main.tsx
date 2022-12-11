import App from './App'
import {createRoot} from 'react-dom/client'
import React, {StrictMode} from 'react'

const main = async () => {
	createRoot(document.getElementById('root')).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}
main()
