import {useState} from 'react'
import {
	getBasicIncomeDeduction,
	getBasicTaxDeduction,
	getEarningDeduction,
	getElderFamilyDependantDeduction,
	getGeneralFamilyDependantDeduction,
	getTaxRate,
	safeParseInt,
	thousandRound,
} from '~/src/lib'
import Currency from '~/src/Currency'
import earningDeductionTable from './assets/earning-deduction.png'
import familyDependantWithIncomeDeductionTable from './assets/family-dependant-with-income-deduction.png'
import taxRateTable from './assets/tax-rate.png'
import disasterTaxTable from './assets/disaster-tax.png'
import incomeTable from './assets/income.png'
import incomeTable2 from './assets/income2.png'
import otherTaxDeductionTable from './assets/other-tax-deduction.png'

export default function App() {
	// earning
	const [salary, setSalary] = useState<number>(3_000_000)
	const [sideJobEarning, setSideJobEarning] = useState<number>(1000000)

	// income
	const earning = salary + sideJobEarning
	const earningDeduction = getEarningDeduction(earning)

	const income = Math.max(earning - earningDeduction, 0) // = deductedEarning

	// income deduction
	const basicIncomeDeduction = getBasicIncomeDeduction(income)

	const [generalFamilyDependantCount, setGeneralFamilyDependantCount] = useState(0)
	const generalFamilyDependantDeduction = getGeneralFamilyDependantDeduction(
		generalFamilyDependantCount,
		income,
	)

	const [elderFamilyDependantCount, setElderFamilyDependantCount] = useState(0)
	const elderFamilyDependantDeduction = getElderFamilyDependantDeduction(
		elderFamilyDependantCount,
		income,
	)

	const [studentDependantCount, setStudentDependantCount] = useState(0)
	const studentDependantDeduction = studentDependantCount * 630_000

	const [generalDependantCount, setGeneralDependantCount] = useState(0)
	const generalDependantDeduction = generalDependantCount * 380_000

	const [otherIncomeDeduction, setOtherIncomeDeduction] = useState(0)

	const incomeDeduction =
		basicIncomeDeduction +
		generalFamilyDependantDeduction +
		elderFamilyDependantDeduction +
		studentDependantDeduction +
		generalDependantDeduction +
		otherIncomeDeduction

	// tax
	const taxedIncome = Math.max(income - incomeDeduction, 0)
	const roundedTaxedIncome = thousandRound(taxedIncome)
	const taxRate = getTaxRate(roundedTaxedIncome)

	const basicTaxDeduction = getBasicTaxDeduction(roundedTaxedIncome)
	const [otherTaxDeduction, setOtherTaxDeduction] = useState(0)

	const basicTax = Math.max(roundedTaxedIncome * taxRate - basicTaxDeduction - otherTaxDeduction, 0) // deducted tax

	const disasterTax = (basicTax * 2.1) / 100

	const tax = basicTax + disasterTax

	return (
		<>
			<header>
				<h1>Thuế thu nhập cá nhân ở Nhật</h1>
			</header>

			<h3>Thu nhập</h3>
			<div>
				<div>
					<label htmlFor="salary">Lương + Thưởng (給与)</label>
				</div>
				<div>
					<input
						name="salary"
						onChange={evt => setSalary(safeParseInt(evt.target.value))}
						value={salary}
					/>
					<span>
						<Currency amount={earning} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Nếu công ty bạn có nộp trước thuế (源泉徴収) thì mục này nhập vào lương trước khi trừ
							thuế nộp trước.{' '}
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1400.htm"
							>
								No.1400 給与所得
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>
					<label htmlFor="profit">Thu nhập làm thêm (事業総収入)</label>
				</div>
				<div>
					<input
						name="profit"
						onChange={evt => setSideJobEarning(safeParseInt(evt.target.value))}
						value={sideJobEarning}
					/>
					<span>
						<Currency amount={sideJobEarning} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Khoản đi làm thêm thường được tính là thu nhập qua doanh nghiệp cá nhân (個人事業).
						</p>
						<p>
							Ở mục này điền vào lợi nhuận (収入, earning), tức doanh thu (売上, revenue) - chi phí
							(必要経費, expense).{' '}
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1350.htm"
							>
								No.1350 事業所得の課税のしくみ(事業所得)
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>Tổng thu nhập (収入)</div>
				<div>
					<b>
						<Currency amount={earning} />
					</b>
				</div>
			</div>

			<h3 className="mt-8">Khấu trừ trước thuế</h3>

			<h4>Khấu trừ lần 1 (収入から差し引かれる金額)</h4>
			<div>
				<details>
					<summary>Xem thêm</summary>
					<p>
						<a
							target="_blank"
							href="https://www.nta.go.jp/taxes/shiraberu/shinkoku/tebiki/2016/b/01/yogo/1_y03.htm"
						>
							収入から差し引かれる金額
						</a>
					</p>
				</details>
			</div>

			<div>
				<div>Khấu trừ thu nhập trước thuế (給与所得控除)</div>
				<div>
					<Currency amount={earningDeduction} />
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							<img src={earningDeductionTable} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm"
							>
								No.1410 給与所得控除
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>Thu nhập sau khấu trừ lần 1 (所得)</div>
				<div>
					<Currency amount={income} />
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							<img src={incomeTable} />
							<img src={incomeTable2} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1000.htm"
							>
								No.1000 所得税のしくみ
							</a>
						</p>
					</details>
				</div>
			</div>

			<h4>Khấu trừ lần 2 (所得控除)</h4>
			<div>
				<div>Khấu trừ cơ bản (基礎控除)</div>
				<div>
					<Currency amount={basicIncomeDeduction} />
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Từ năm 2018 về trước, mục này được tính dựa trên “Thu nhập sau khấu trừ lần 1”. Từ năm
							2019 trở đi tất cả đều được khấu trừ 38 man yên.
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm"
							>
								No.1199 基礎控除
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>
					<label htmlFor="generalFamilyDependantCount">
						Số người phụ thuôc cùng hộ gia đình (dưới 70 tuổi) (一般の控除対象配偶者)
					</label>
				</div>
				<div>
					<input
						name="generalFamilyDependantCount"
						value={generalFamilyDependantCount}
						onChange={evt => setGeneralFamilyDependantCount(safeParseInt(evt.target.value))}
					/>
					<span>
						<Currency amount={generalFamilyDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Đối tượng: vợ, chồng, con cái, bố, mẹ, ... dưới 70 tuổi.</p>
						<p>
							Nếu người phụ thuộc có thu nhập cao hơn 103 man yên (tức thu nhập sau khấu trừ lần 1
							cao hơn 48 man yên) không được tính ở đây.
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm"
							>
								No.1191 配偶者控除
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>
					<label htmlFor="elderFamilyDependantCount">
						Số người phụ thuôc cùng hộ gia đình (70 tuổi trở lên) (老人控除対象配偶者)
					</label>
				</div>
				<div>
					<input
						name="elderFamilyDependantCount"
						value={elderFamilyDependantCount}
						onChange={evt => setElderFamilyDependantCount(safeParseInt(evt.target.value))}
					/>
					<span>
						<Currency amount={elderFamilyDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Đối tượng: vợ, chồng, con cái, bố, mẹ ... từ 70 tuổi trở lên</p>
						<p>
							Nếu người phụ thuộc có thu nhập cao hơn 103 man yên (tức thu nhập sau khấu trừ lần 1
							cao hơn 48 man yên) không được tính ở đây.
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm"
							>
								No.1191 配偶者控除
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>
					<label htmlFor="studentDependantCount">
						Số người phụ thuôc khác hộ gia đình (độ tuổi sinh viên) (特定扶養親族)
					</label>
				</div>
				<div>
					<input
						name="studentDependantCount"
						value={studentDependantCount}
						onChange={evt => setStudentDependantCount(safeParseInt(evt.target.value))}
					/>
					<span>
						<Currency amount={studentDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Đối tượng: anh, chị, em, bố mẹ không sinh sống cùng.</p>
						<p>
							Nếu người phụ thuộc có thu nhập cao hơn 103 man yên (tức thu nhập sau khấu trừ lần 1
							cao hơn 48 man yên) không được tính ở đây.
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm"
							>
								No.1180 扶養控除
							</a>
						</p>
						<p>Độ tuổi sinh viên: từ 19 đến 23 tuổi.</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/yogo/senmon.htm#word9"
							>
								専門用語集
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>
					<label htmlFor="generalDependantCount">
						Số người phụ thuôc khác hộ gia đình (thông thường) (一般の控除対象扶養親族)
					</label>
				</div>
				<div>
					<input
						name="generalDependantCount"
						value={generalDependantCount}
						onChange={evt => setGeneralDependantCount(safeParseInt(evt.target.value))}
					/>
					<span>
						<Currency amount={generalDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Đối tượng: anh, chị, em, bố mẹ không sinh sống cùng.</p>
						<p>
							Nếu người phụ thuộc có thu nhập cao hơn 103 man yên (tức thu nhập sau khấu trừ lần 1
							cao hơn 48 man yên) không được tính ở đây.
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm"
							>
								No.1180 扶養控除
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>
					<label htmlFor="dependantStudents">Khấu trừ khác</label>
				</div>
				<div>
					<input
						name="otherIncomeDeduction"
						value={otherIncomeDeduction}
						onChange={evt => setOtherIncomeDeduction(safeParseInt(evt.target.value))}
					/>
					<span>
						<Currency amount={otherIncomeDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Các khoản khấu trừ khác thì tự tính riêng và nhập vào đây.</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1100.htm"
							>
								No.1100 所得控除のあらまし
							</a>
						</p>
						<p>Phổ biến nhất là trường hợp vợ hoặc chồng có thu nhập từ 103 man trở lên.</p>
						<p>
							<img src={familyDependantWithIncomeDeductionTable} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1195.htm"
							>
								No.1195 配偶者特別控除
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>Thu nhập chịu thuế (課税所得)</div>
				<div>
					<b>
						<Currency amount={roundedTaxedIncome} />
					</b>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Thu nhập chịu thuế = Thu nhập trước thuế - Tổng các khoản khấu trừ trước thuế (lần 1
							và lần 2).
						</p>
						<p>Bỏ phần dư và làm tròn đến hàng nghìn.</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2011.htm"
							>
								No.2011 課税される所得と非課税所得
							</a>
						</p>
					</details>
				</div>
			</div>

			<h3 className="mt-8">Thuế thu nhập</h3>
			<div>
				<div>Thuế suất (税率): {taxRate * 100}%</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							<img src={taxRateTable} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm"
							>
								No.2260 所得税の税率
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>Khấu trừ thuế trong công thức (基礎所得税控除)</div>
				<div>
					<Currency amount={basicTaxDeduction} />
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Khoản khấu trừ cố định theo công thức thuế.</p>
						<p>
							<img src={taxRateTable} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm"
							>
								No.2260 所得税の税率
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>
					<label htmlFor="otherTaxDeduction">Khấu trừ thuế (所得税控除)</label>
				</div>
				<div>
					<input
						name="otherTaxDeduction"
						value={otherTaxDeduction}
						onChange={evt => setOtherTaxDeduction(safeParseInt(evt.target.value))}
					/>
					<Currency amount={otherTaxDeduction} />
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Tính toán và nhập tổng các khoản giảm thuế khác tại đây.</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1200.htm"
							>
								No.1200 税額控除
							</a>
						</p>
						<p>
							<img src={otherTaxDeductionTable} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1250.htm"
							>
								No.1250 配当所得があるとき(配当控除)
							</a>
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1260.htm"
							>
								No.1260 政党等寄附金特別控除制度
							</a>
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1263.htm"
							>
								No.1263 認定NPO法人に寄附をしたとき
							</a>
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1266.htm"
							>
								No.1266 公益社団法人等に寄附をしたとき
							</a>
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1210.htm"
							>
								No.1210 マイホームの取得等と所得税の税額控除
							</a>
						</p>
					</details>
				</div>
			</div>

			<div className="mb-8">
				<div>Thuế thu nhập cơ bản (基準所得税額)</div>
				<div>
					<Currency amount={basicTax} />
				</div>
			</div>

			<div>
				<div>Thuế khắc phục thiên tai (復興特別所得税)</div>
				<div>
					<Currency amount={disasterTax} />
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>Là khoản 2.1% từ thuế thu nhập cơ bản, được thu từ năm 2013 đến năm 2037.</p>
						<p>
							<img src={disasterTaxTable} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm"
							>
								No.2260 所得税の税率
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<div>Tổng thuế thu nhập (申告納税額)</div>
				<div>
					<b>
						<h2>
							<Currency amount={tax} />
						</h2>
					</b>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Đây là khoản thuế phải đóng cho nhà nước. Dựa vào số tiền mã công ty đã nộp trước
							(源泉徴収税額や予定納税額) mà bạn sẽ cần phải đóng bổ sung (納める) nếu thiếu, hoặc
							được cục thuế hoàn tiền (還付) nếu thừa, dựa theo số tiền chênh lệch.
						</p>
					</details>
				</div>
			</div>

			<footer style={{textAlign: 'center'}}>
				MIT License |{' '}
				<a target="_blank" href="https://github.com/taxj/taxj">
					Mã nguồn
				</a>
			</footer>
		</>
	)
}
