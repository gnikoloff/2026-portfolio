export function getFormattedDate(date: Date) {
	const formatNumber = (v: number) => {
		let numberFormat;
		if (v < 10) {
			numberFormat = `0${v}`;
		} else {
			numberFormat = v.toString();
		}
		return numberFormat;
	};
	const day = formatNumber(date.getDate());
	const month = formatNumber(date.getMonth() + 1);
	const year = formatNumber(date.getFullYear());

	return `${day}.${month}.${year}`;
}
