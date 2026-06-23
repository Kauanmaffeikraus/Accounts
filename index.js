// modulos externos
import inquirer from 'inquirer'
import chalk from 'chalk'

// modulos internos
import fs from 'fs'

operation()

function operation() {

    inquirer.prompt([{
        type: 'select',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
        ],
    },
])
    .then((answer) => {
        const action = answer['action'] 
    
        if (action === 'Criar conta') {
            createAccount()
        } else if (action === 'Depositar') {
            deposit()
        } else if (action === 'Consultar Saldo') {
            getAccountBalance()
        } else if (action === 'Sacar') {
            withdraw()
        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }
    })
    .catch(err => console.log(err))
}
    // create an account

    function createAccount() {
        console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
        console.log(chalk.green('Defina as opções da sua conta a seguir:'))

        buildAccount()
}

function buildAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para a sua conta:',
    },

    ])
    .then((answer) => {
        const accountName = answer['accountName']

        console.info(accountName)
        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }
        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            if (err) {
                console.log(err)
            }
        })

        console.log(chalk.green('Parabéns, sua conta foi criada!'))
        operation()
    })
    .catch(err => console.log(err))
}

// add an amount to user account

function deposit() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
    },
    {
        name: 'amount',
        message: 'Qual o valor do depósito?',
    }])
    .then((answer) => {
        const accountName = answer['accountName']
        const amount = parseFloat(answer['amount'])

        if (isNaN(amount) || amount <= 0) {
            console.log(chalk.bgRed.black('Valor inválido!'))
            deposit()
            return
        }

        if (!fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Conta não encontrada!'))
            deposit()
            return
        }

        const accountData = JSON.parse(fs.readFileSync(`accounts/${accountName}.json`, 'utf8'))
        accountData.balance += amount
        fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData))

        console.log(chalk.green(`Depósito realizado com sucesso! Saldo: R$ ${accountData.balance.toFixed(2)}`))
        operation()
    })
    .catch(err => console.log(err))
}

    // show account balance

    function getAccountBalance() {
        inquirer.prompt([{
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        }])
        .then((answer) => {
            const accountName = answer['accountName']

            if (!fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(chalk.bgRed.black('Conta não encontrada!'))
                getAccountBalance()
                return
            }

            const accountData = JSON.parse(fs.readFileSync(`accounts/${accountName}.json`, 'utf8'))
            console.log(chalk.green(`Saldo da conta ${accountName}: R$ ${accountData.balance.toFixed(2)}`))
            operation()
        })
        .catch(err => console.log(err))
    }

    function withdraw() {
        inquirer.prompt([{
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        },
        {
            name: 'amount',
            message: 'Qual o valor do saque?',
        }])
        .then((answer) => {
            const accountName = answer['accountName']
            const amount = parseFloat(answer['amount'])

            if (isNaN(amount) || amount <= 0) {
                console.log(chalk.bgRed.black('Valor inválido!'))
                withdraw()
                return
            }

            if (!fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(chalk.bgRed.black('Conta não encontrada!'))
                withdraw()
                return
            }

            const accountData = JSON.parse(fs.readFileSync(`accounts/${accountName}.json`, 'utf8'))
            if (accountData.balance < amount) {
                console.log(chalk.bgRed.black('Saldo insuficiente!'))
                withdraw()
                return
            }

            accountData.balance -= amount
            fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData))

            console.log(chalk.green(`Saque realizado com sucesso! Saldo: R$ ${accountData.balance.toFixed(2)}`))
            operation()
        })
        .catch(err => console.log(err))
    }