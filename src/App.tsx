import {
	getBasicIncomeDeduction,
	getBasicTaxDeduction,
	getSalaryDeduction,
	getElderFamilyDependantDeduction,
	getGeneralFamilyDependantDeduction, getNearbyTaxRates,
	getTaxRate,
	safeParseInt,
	thousandRound,
	useLocalStorage,
} from '~/src/lib'
import Currency from '~/src/Currency'
import earningDeductionTable from './assets/earning-deduction.png'
import familyDependantWithIncomeDeductionTable from './assets/family-dependant-with-income-deduction.png'
import taxRateTable from './assets/tax-rate.png'
import disasterTaxTable from './assets/disaster-tax.png'
import incomeTable from './assets/income.png'
import incomeTable2 from './assets/income2.png'
import otherTaxDeductionTable from './assets/other-tax-deduction.png'
import tokyoTaxTable from './assets/tokyo-tax.png'
import digitalAccountBookLawUpdate2023 from './assets/digital-account-book-law-update-2023.png'

export default function App() {
	// earning
	const [salaryStr, setSalaryStr] = useLocalStorage('salary', '3,000,000')
	const salary = safeParseInt(salaryStr)
	const salaryDeduction = getSalaryDeduction(salary)
	const netSalary = Math.max(salary - salaryDeduction, 0)

	const [businessRevenueStr, setBusinessRevenueStr] = useLocalStorage('businessRevenue', '0')
	const businessRevenue = safeParseInt(businessRevenueStr)
	const [businessExpenseStr, setBusinessExpenseStr] = useLocalStorage('businessCost', '0')
	const businessExpense = safeParseInt(businessExpenseStr)
	const businessProfit = Math.max(businessRevenue - businessExpense, 0)

	const totalEarning = salary + businessRevenue
	const totalExpense = salaryDeduction + businessExpense
	// net income
	const netIncome = netSalary + businessProfit

	// income deduction
	const basicIncomeDeduction = getBasicIncomeDeduction(netIncome)

	const [generalFamilyDependantCountStr, setGeneralFamilyDependantCountStr] = useLocalStorage(
		'generalFamilyDependantCount',
		'0',
	)
	const generalFamilyDependantCount = safeParseInt(generalFamilyDependantCountStr)

	const generalFamilyDependantDeduction = getGeneralFamilyDependantDeduction(
		generalFamilyDependantCount,
		netIncome,
	)

	const [elderFamilyDependantCountStr, setElderFamilyDependantCountStr] = useLocalStorage(
		'elderFamilyDependantCount',
		'0',
	)
	const elderFamilyDependantCount = safeParseInt(elderFamilyDependantCountStr)
	const elderFamilyDependantDeduction = getElderFamilyDependantDeduction(
		elderFamilyDependantCount,
		netIncome,
	)

	const [studentDependantCountStr, setStudentDependantCountStr] = useLocalStorage(
		'studentDependantCount',
		'0',
	)
	const studentDependantCount = safeParseInt(studentDependantCountStr)
	const studentDependantDeduction = studentDependantCount * 630_000

	const [generalDependantCountStr, setGeneralDependantCountStr] = useLocalStorage(
		'generalDependantCount',
		'0',
	)
	const generalDependantCount = safeParseInt(generalDependantCountStr)
	const generalDependantDeduction = generalDependantCount * 380_000

	const [otherIncomeDeductionStr, setOtherIncomeDeductionStr] = useLocalStorage(
		'otherIncomeDeduction',
		'0',
	)
	const otherIncomeDeduction = safeParseInt(otherIncomeDeductionStr)

	const incomeDeduction =
		basicIncomeDeduction +
		generalFamilyDependantDeduction +
		elderFamilyDependantDeduction +
		studentDependantDeduction +
		generalDependantDeduction +
		otherIncomeDeduction

	// tax
	const taxedIncome = Math.max(netIncome - incomeDeduction, 0)
	const roundedTaxedIncome = thousandRound(taxedIncome)
	const taxRate = getTaxRate(roundedTaxedIncome)
	const {previous: previousTaxRate, current: currentTaxRate, next: nextTaxRate} = getNearbyTaxRates(roundedTaxedIncome)

	const basicTaxDeduction = getBasicTaxDeduction(roundedTaxedIncome)
	const [otherTaxDeductionStr, setOtherTaxDeductionStr] = useLocalStorage('otherTaxDeduction', '0')
	const otherTaxDeduction = safeParseInt(otherTaxDeductionStr)

	const basicTax = Math.max(roundedTaxedIncome * taxRate - basicTaxDeduction - otherTaxDeduction, 0) // deducted tax

	const disasterTax = (basicTax * 2.1) / 100

	const tax = basicTax + disasterTax

	return (
		<>
			<header>
				<h1>Thuế thu nhập cá nhân ở Nhật</h1>
				<p>
					<i>Cập nhật ngày 15 tháng 3 năm 2023</i>
				</p>
			</header>

			<h3>Lương và doanh thu</h3>
			<div>
				<div>
					<label htmlFor="salary">Lương + Thưởng (給与)</label>
				</div>
				<div>
					<input
						name="salary"
						onChange={evt => setSalaryStr(evt.target.value)}
						value={salaryStr}
						id="salary"
					/>
					<span>
						<Currency amount={salary} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Nếu công ty bạn có nộp trước thuế (源泉徴収) thì mục này nhập vào lương trước khi trừ
							thuế nộp trước.
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
					<label htmlFor="businessRevenue">Thu nhập làm thêm (事業総収入)</label>
				</div>
				<div>
					<input
						name="businessRevenue"
						id="businessRevenue"
						onChange={evt => setBusinessRevenueStr(evt.target.value)}
						value={businessRevenueStr}
					/>
					<span>
						<Currency amount={businessRevenue} />
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
						<Currency amount={netIncome} />
					</b>
				</div>
			</div>

			<h3 className="mt-8">Chi phí (収入から差し引かれる金額)</h3>
			<i>
				Bạn có thể khai báo mục chi phí cho các thu nhập ngoài lương tại đây.
				Với thu nhập từ lương chính sẽ có công thức tính cố định.
			</i>
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
				<div>Chi phí cố định theo mức lương (給与所得控除)</div>
				<div>
					<Currency amount={salaryDeduction} />
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
			</div>
			<div>
			</div>
			<div>
				<div>
					<label htmlFor="businessExpense">
						Chi phí dành cho thu nhập ngoài lương (必要経費)
					</label>
				</div>
				<input
					name="businessExpense"
					id="businessExpense"
					value={businessExpenseStr}
					onChange={evt => setBusinessExpenseStr(evt.target.value)}
				/>
				<span><Currency amount={businessExpense} /></span>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Ở mục này bạn khai báo các chi phí cho công việc ngoài lương của bạn.
							Các chi phí này được chia làm nhiều mục nhỏ (23 mục, gồm điện, nước, chiếu sáng, ăn uống, thiết bị, trả lương, đi lại, vv).
							Bạn có nghĩa vụ phải lưu trữ các giấy tờ liên quan đến chi phí này để làm bằng chứng và giữ lại trong ít nhất 7 năm sau khi khai báo thuế.
						</p>
						<p>
							Bộ luật về lưu trữ sổ kế toán điện tử sửa đổi (<a
							target="_blank"
							href="https://www.nta.go.jp/law/joho-zeikaishaku/sonota/jirei/pdf/0021005-038.pdf"
						>
							改正電子帳簿保存法
						</a>, bộ luật này ra đời vào năm 1998 và được sửa đổi nhiều lần) ngày 1 tháng 1 năm 2022 có 2 sửa đổi chính liên quan đến sổ kế toán điện tử.
						</p>
						<p>
							<ul>
								<li>
									国税関係帳簿書類の電子化要件の緩和: đơn giản hoá các thủ tục về số hoá sổ kế toán.
									Trước kia bạn cần đăng ký với cục thuế về định dạng hoặc phần mềm làm sổ kế toán để có thể số hoá.
									Bộ luật sửa đổi có đưa ra các điều kiện sẵn.
									Nếu phần mềm kế toán của bạn bảo đảm các tiêu chi này thì bạn không cần đăng ký với cục thuế nữa.
								</li>
								<li>電子取引の電子データ保存義務化: <b>các giấy tờ liên quan tới chi phí doanh nghiệp, tức sổ kế toán và giấy tờ liên quan, từ ngày 1 tháng 1 năm 2024 phải được lưu trữ dưới dạng số</b>.</li>
							</ul>
						</p>
						<p>
							<img src={digitalAccountBookLawUpdate2023} />
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2210.htm"
							>
								No.2210 やさしい必要経費の知識
							</a>
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.keisan.nta.go.jp/r4yokuaru/aoiroshinkoku/hitsuyokeihi/index.html"
							>
								確定申告書等作成コーナー　必要経費
							</a>
						</p>
					</details>
				</div>
			</div>

			<div>
				<h4 className="text-green-500">Thu nhập ròng (thu nhập sau khi trừ chi phí) (所得)</h4>
				<h3 className="text-green-500">
					<Currency amount={netIncome} />
				</h3>
				<p>
					Đây là một trong những con số quan trọng dùng để khai báo, hoặc xét duyệt các thủ tục liên quan đến thu nhập.
					Ví dụ như xét duyệt xem có được tính là người phụ thuộc hay không, hoặc các khấu trừ khác, vv
				</p>
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

			<h3>Khấu trừ trước thuế (所得控除)</h3>
			<div>
				<div>Khấu trừ cơ bản (基礎控除)</div>
				<div>
					<Currency amount={basicIncomeDeduction} />
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Từ năm 2018 về trước, mục này được tính dựa trên “thu nhập ròng”. Từ năm
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
						Số người phụ thuôc thông thường (一般の控除対象配偶者)
					</label>
				</div>
				<div>
					<input
						name="generalFamilyDependantCount"
						id="generalFamilyDependantCount"
						value={generalFamilyDependantCountStr}
						onChange={evt => setGeneralFamilyDependantCountStr(evt.target.value)}
					/>
					<span>
						<Currency amount={generalFamilyDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Điều kiện:
							<ul>
								<li>
									Đối tượng: vợ, chồng, con cái, bố, mẹ, ...
								</li>
								<li>
									Sống cùng hộ gia đình.
								</li>
								<li>
									Dưới 70 tuổi.
								</li>
								<li>
									Thu nhập không quá 103 man yên (tức thu nhập ròng không quá 48 man yên).
									Nếu thu nhập cao hơn, đưa vào mục Khấu trừ khác.
								</li>
							</ul>
						</p>
						<p>
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
						Số người phụ thuôc cao tuổi (老人控除対象配偶者)
					</label>
				</div>
				<div>
					<input
						name="elderFamilyDependantCount"
						id="elderFamilyDependantCount"
						value={elderFamilyDependantCountStr}
						onChange={evt => setElderFamilyDependantCountStr(evt.target.value)}
					/>
					<span>
						<Currency amount={elderFamilyDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Điều kiện: giống ở trên ngoại trừ điều kiện về tuổi.
							<ul>
								<li>
									Đối tượng: vợ, chồng, con cái, bố, mẹ, ...
								</li>
								<li>
									Sống cùng hộ gia đình.
								</li>
								<li>
									Từ 70 tuổi trở lên.
								</li>
								<li>
									Thu nhập không quá 103 man yên (tức thu nhập ròng không quá 48 man yên).
									Nếu thu nhập cao hơn, đưa vào mục Khấu trừ khác.
								</li>
							</ul>
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
						Số người cần chăm sóc (特定扶養親族)
					</label>
				</div>
				<div>
					<input
						name="studentDependantCount"
						id="studentDependantCount"
						value={studentDependantCountStr}
						onChange={evt => setStudentDependantCountStr(evt.target.value)}
					/>
					<span>
						<Currency amount={studentDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Điều kiện:
							<ul>
								<li>
									Đối tượng: anh, chị, em, bố mẹ, ...
								</li>
								<li>
									Không cùng hộ gia đình.
								</li>
								<li>
									Độ tuổi sinh viên (tức từ 19 đến 23 tuổi).
								</li>
								<li>
									Thu nhập không quá 103 man yên (tức thu nhập ròng không quá 48 man yên).
								</li>
							</ul>
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1180.htm"
							>
								No.1180 扶養控除
							</a>
						</p>
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
						Số người phụng dưỡng (一般の控除対象扶養親族)
					</label>
				</div>
				<div>
					<input
						name="generalDependantCount"
						id="generalDependantCount"
						value={generalDependantCountStr}
						onChange={evt => setGeneralDependantCountStr(evt.target.value)}
					/>
					<span>
						<Currency amount={generalDependantDeduction} />
					</span>
				</div>
				<div>
					<details>
						<summary>Xem thêm</summary>
						<p>
							Điều kiện: tương tự ở trên ngoại trừ điều kiện về tuổi.
							<ul>
								<li>
									Đối tượng: anh, chị, em, bố mẹ, ...
								</li>
								<li>
									Không cùng hộ gia đình.
								</li>
								<li>
									Ngoài độ tuổi sinh viên (tức ngoài khoảng 19 đến 23 tuổi).
								</li>
								<li>
									Thu nhập không quá 103 man yên (tức thu nhập ròng không quá 48 man yên).
								</li>
							</ul>
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
						id="otherIncomeDeduction"
						value={otherIncomeDeductionStr}
						onChange={evt => setOtherIncomeDeductionStr(evt.target.value)}
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
						<p>Ví dụ: với người phụ thuộc có thu nhập từ 103 man trở lên (tức thu nhập ròng {'>='} 48 man).</p>
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
						<p>
							Khai báo thuế giấy xanh (青色申告): được giảm 10 man, 55 man, hoặc 65 man tuỳ theo điều kiện.
							Áp dụng cho người có thu nhập ngoài lương chính.
						</p>
						<p>
							<a
								target="_blank"
								href="https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1195.htm"
							>
								No.2072 青色申告特別控除
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
							Thu nhập chịu thuế = Doanh thu và lương (<Currency amount={totalEarning}/>) - Chi phí (<Currency amount={totalExpense}/>) - Các khấu trừ trước thuế (<Currency amount={incomeDeduction}/>).
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
				<div>Thuế suất (税率): <h4 className="inline"><b>{taxRate * 100}%</b></h4></div>
				{previousTaxRate && <div className="italic">
					Bạn cần phải giảm hoặc khấu trừ thêm ít nhất <b className="text-green-500"><Currency amount={roundedTaxedIncome - previousTaxRate[0]}/></b> yên để giảm thuế suất xuống từ {taxRate * 100}% xuống <b className="text-green-500">{previousTaxRate[1] * 100}%</b>.
				</div>}
				{nextTaxRate && <div className="italic">
					Nếu bạn tăng thu nhập thêm <b className="text-red-500"><Currency amount={currentTaxRate[0] - roundedTaxedIncome + 1}/></b> yên thì thuế suất sẽ tăng lên từ {taxRate * 100}% lên <b className="text-red-500">{nextTaxRate[1] * 100}%</b>.
				</div>}
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
				<div>Khấu trừ cơ bản sau thuế (基礎所得税控除)</div>
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
					<label htmlFor="otherTaxDeduction">Khấu trừ thuế (税額控除)</label>
				</div>
				<div>
					<input
						name="otherTaxDeduction"
						id="otherTaxDeduction"
						value={otherTaxDeductionStr}
						onChange={evt => setOtherTaxDeductionStr(evt.target.value)}
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
							Đây là khoản thuế phải đóng cho cục thuế. Dựa vào số tiền mà công ty đã nộp trước
							(源泉徴収税額や予定納税額) mà bạn sẽ cần phải đóng bổ sung (納める) nếu thiếu, hoặc
							được cục thuế hoàn tiền (還付) nếu thừa, dựa theo số tiền chênh lệch.
						</p>
						<p>
							Khoản thuế này chưa bao gồm thuế thị dân (住民税). Mỗi khu vực sống có công thức tính
							thuế riêng. Ví dụ ở Tokyo, bạn tham khảo đường dẫn sau:
						</p>
						<p>
							<a target="_blank" href="https://www.tax.metro.tokyo.lg.jp/kazei/kojin_ju.html">
								個人住民税
							</a>
						</p>
						<p>
							<img src={tokyoTaxTable} />
						</p>
						<p>
							均等割は、定額で課税されます。 個人都民税の税額は1,500
							円、個人区市町村民税の税額は3,500 円です。
							※平成26年度から令和5年度までの間、地方自治体の防災対策に充てるため、個人住民税の均等割額は都民税・区市町村民税それぞれ500円が加算されています。
						</p>
					</details>
				</div>
			</div>
		</>
	)
}
