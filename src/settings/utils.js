function getDateText(month_num) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    try {
        return months[month_num - 1]
    } catch (err) {
        console.log(err)
        return null
    }
}

export {
	getDateText
}