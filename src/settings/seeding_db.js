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
        value: 'bills_and_utilities'
    }, {
        label: 'Education',
        value: 'education'
    }, {
        label: 'Entertainment',
        value: 'entertainment'
    }, {
        label: 'Family',
        value: 'family'
    }, {
        label: 'Fees and Charges',
        value: 'fee_and_charge' 
    }, {
        label: 'Food and Beverage',
        value: 'food_and_bev'
    }, {
        label: 'Friends and Lover',
        value: 'friends_and_lovers'
    }, {
        label: 'Gifts and Donations',
        value: 'gifts_and_donations'
    }, {
        label: 'Health and Fitness',
        value: 'health_and_fitness'
    }, {
        label: 'Insurances',
        value: 'insurances'
    }, {
        label: 'Investment',
        value: 'investment'
    }, {
        label: 'Shopping',
        value: 'shopping'
    }, {
        label: 'Transportation',
        value: 'transportation'
    }, {
        label: 'Travel',
        value: 'travel'
    }, ],
    income: [{
        label: 'Award',
        value: 'award'
    }, {
        label: 'Gifts',
        value: 'gifts'
    }, {
        label: 'Invest Money',
        value: 'invest_money'
    }, {
        label: 'Others',
        value: 'others'
    }, {
        label: 'Salary',
        value: 'salary'
    }, {
        label: 'Selling',
        value: 'selling'
    }, ],
    debts_and_loans: [{
        label: 'Debt',
        value: 'debt'
    }, {
        label: 'Loan',
        value: 'loan'
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
            data: []
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
