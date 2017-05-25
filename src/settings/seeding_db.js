import router from 'root_dir/router'
require('pouchdb-browser')
var PouchDB = require('pouchdb-browser')
var Database = new PouchDB('local_db', { adapter: 'websql' })

// Setup PIN CODE for the first time
Database.get("first_login").then(function(doc) {
    // console.log(doc)
}).catch(function(err) {
    console.log(err)
    if (err.name === 'not_found') {
        return Database.put({
            _id: "first_login",
            status: true
        }).then(function(res) {
            console.log("Updated " + res.toString() + ', redirect to home')

            router.push('/')
        }).catch(function(err) {
            console.log(err)
        })
    } else { // hm, some other error
        throw err
    }

})

// Setup category first
var data = {
    outcome: [{
        label: 'Bills & Utilities',
        value: 'bills_and_utilities',
        color: '#ffffff'
    }, {
        label: 'Education',
        value: 'education',
        color: '#45b39c'
    }, {
        label: 'Entertainment',
        value: 'entertainment',
        color: '#2ca5d5'
    }, {
        label: 'Family',
        value: 'family',
        color: '#e5905e'
    }, {
        label: 'Fees and Charges',
        value: 'fee_and_charge',
        color: '#dab33a'
    }, {
        label: 'Food and Beverage',
        value: 'food_and_bev',
        color: '#ef4e4f'
    }, {
        label: 'Friends and Lover',
        value: 'friends_and_lovers',
        color: '#ef4e4f'
    }, {
        label: 'Gifts and Donations',
        value: 'gifts_and_donations',
        color: '#334d5c'
    }, {
        label: 'Health and Fitness',
        value: 'health_and_fitness',
        color: '#df5b4a'
    }, {
        label: 'Insurances',
        value: 'insurances',
        color: '#ffefbd'
    }, {
        label: 'Investment',
        value: 'investment',
        color: '#edc54b'
    }, {
        label: 'Shopping',
        value: 'shopping',
        color: '#364e5c'
    }, {
        label: 'Transportation',
        value: 'transportation',
        color: '#37917f'
    }, {
        label: 'Travel',
        value: 'travel',
        color: '#db783c'
    }, ],
    income: [{
        label: 'Award',
        value: 'award',
        color:'#efc84a'
    }, {
        label: 'Gifts',
        value: 'gifts',
        color: '#128f79'
    }, {
        label: 'Invest Money',
        value: 'invest_money',
        color: '#e07b40'
    }, {
        label: 'Others',
        value: 'others',
        color: '#dab33a'
    }, {
        label: 'Salary',
        value: 'salary',
        color: '#009f83'
    }, {
        label: 'Selling',
        value: 'selling',
        color: '#00b0ea'
    }, ],
    debts_and_loans: [{
        label: 'Debt',
        value: 'debt',
        color: '#e1f8ff'
    }, {
        label: 'Loan',
        value: 'loan',
        color: '#fdc5c6'
    }, ]
}
console.log(data)
    // Setup PIN CODE for the first time
Database.get("fiper_category").then(function(doc) {
    // console.log(doc)
    console.log('already had')
}).catch(function(err) {
    console.log(err)
    if (err.name === 'not_found') {
        return Database.put({
            _id: "fiper_category",
            data: data
        }).then(function(res) {
            console.log("Updated " + res.toString() + ', redirect to home')

            router.push('/')
        }).catch(function(err) {
            console.log(err)
        })
    } else { // hm, some other error
        throw err
    }

})

// Setup fiper for the first time
Database.get("fiper").then(function(doc) {
    // console.log(doc)
}).catch(function(err) {
    console.log(err)
    if (err.name === 'not_found') {
        return Database.put({
            _id: "fiper",
            data: {
                income: [],
                outcome: [],
                debts_and_loans: []
            }
        }).then(function(res) {
            console.log("Updated " + res.toString() + ', redirect to home')

            router.push('/')
        }).catch(function(err) {
            console.log(err)
        })
    } else { // hm, some other error
        throw err
    }

})
