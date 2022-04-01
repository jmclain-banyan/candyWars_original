

const generateMarket = () => {
    const range = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
    let productMarket = [
        {
            name: 'Gum Drops',
            productId: 'gumDrops',
            quanity: range(25, 100),
            price: range(2, 8),
            toBePurchsed: 0,
            toBeSold: 0
        },
        {
            name: 'Laffy Taffy',
            productId: 'laffyTaffy',
            quanity: range(10, 35),
            price: range(10, 50),
            toBePurchsed: 0,
            toBeSold: 0
        },
        {
            name: 'Pixie Stix',
            productId: 'pixieStix',
            quanity: range(10, 80),
            price: range(5, 15),
            toBePurchsed: 0,
            toBeSold: 0
        },
        {
            name: 'Gobstoppers',
            productId: 'gobstoppers',
            quanity: range(10, 80),
            price: range(5, 15),
            toBePurchsed: 0,
            toBeSold: 0
        },
        {
            name: 'Mars Bars',
            productId: 'marsBars',
            quanity: range(10, 80),
            price: range(5, 15),
            toBePurchsed: 0,
            toBeSold: 0
        },
        {
            name: 'Jelly Beans',
            productId: 'jellyBeans',
            quanity: range(10, 80),
            price: range(5, 15),
            toBePurchsed: 0,
            toBeSold: 0
        }
    ]
    return productMarket
}


const defaultState = {
    cash: 10000,
    turnsLeft: 25,
    showModal: false,
    playerInventory: {
        gumDrops: 0,
        laffyTaffy: 0,
        pixieStix: 0,
        gobstoppers: 0,
        marsBars: 0,
        jellyBeans: 0
    },
    toggleSurplusStore: false,
    statsExpansion: {
        bodyArmor: false,
        armorPlating: false,
        backPack: false,
        trenchCoat: false,
        duffleBag: false,
    },
    playerWepons: {
        ringPops: false,
        sugarCaneBat: false,
        nerfPistol: false,
        bazookaGum: false
    },
    currentInventorySize: 0,
    maxInventorySize: 20,
    currentHealth: 90,
    maxHealth: 100,
    currentLocation: [
        {
            name: 'Home',
            locationId: 'home',
            availibleProduct: []
        }
    ],
    locations: [
        {
            name: 'Candy Land',
            locationId: 'candyLand',
            availibleProduct: []
        },
        {
            name: 'Hershey Park',
            locationId: 'hersheyPark',
            availibleProduct: []
        },
        {
            name: 'Land of Oz',
            locationId: 'landOfOz',
            availibleProduct: []
        },
        {
            name: 'Willy Wonka\'s Factory',
            locationId: 'wonkaFactory',
            availibleProduct: []
        },
        {
            name: 'A Random Place',
            locationId: 'randomPlace',
            availibleProduct: []
        },
    ],
    fightModal: false,
    runFight: false,
    runAwayHit: null,
    bandits: 0,
    banditsHealth: null,
    banditsMaxDamageDeal: 8,
    playerMaxDamageDeal: 5,
    tryFight: false,
    playerHitAmount: null,
    banditHitAmount: null
}

const intercept = () => {
    let x = Math.floor(Math.random() * 100)
    return x % 9 === 0
}

const fightRun = () => {
    let x = Math.floor(Math.random() * 100)
    return x % 3 === 0
}

const generateBandits = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// const attackPoints = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export const reducer = (state = defaultState, action) => {
    
    let selectedProduct = state.currentLocation[0].availibleProduct.filter(x => action.name === x.productId)
    let _product = selectedProduct[0]
    let selectedLocation = state.locations.filter(x => action.location === x.locationId)
    let _expansion = state.statsExpansion
    let _wepons = state.playerWepons
    const calculateInventorySpace = state => {
        let _gumDrops = state.playerInventory.gumDrops
        let _laffyTaffy = state.playerInventory.laffyTaffy
        let _pixieStix = state.playerInventory.pixieStix
        let _gobstoppers = state.playerInventory.gobstoppers
        let _marsBars = state.playerInventory.marsBars
        let _jellyBeans = state.playerInventory.jellyBeans
        return _gumDrops + _laffyTaffy + _pixieStix + _gobstoppers + _marsBars + _jellyBeans
    }
    switch (action.type) {
        case 'UPDATE_LOCATION':
            // console.log(intercept())
            selectedLocation[0].availibleProduct = generateMarket()
            let banditsGEN = generateBandits(1,5)
            let banditsHP = state.banditsHealth = (banditsGEN * 30)
            return Object.assign({}, state, {
                currentLocation: selectedLocation,
                turnsLeft: state.turnsLeft > 0 ? state.turnsLeft -= 1 : state.turnsLeft = 0,
                fightModal: intercept(),
                runFight: false,
                bandits: banditsGEN,
                banditsHealth: banditsHP,
                runAwayHit: null
            })

        case 'INCREMENT_PURCHSE':
            if (_product.quanity) _product.toBePurchsed += 1
            _product.quanity > 0 ? _product.quanity -= 1 : _product.quanity = 0
            return Object.assign({}, state, {})

        case 'DECREMENT_PURCHSE':
            if (_product.toBePurchsed) _product.quanity += 1
            _product.toBePurchsed > 0 ? _product.toBePurchsed -= 1 : _product = 0
            return Object.assign({}, state, {})

        case 'HANDLE_PURCHSE':
            state.playerInventory[_product.productId] += _product.toBePurchsed
            state.cash -= (_product.toBePurchsed * _product.price)
            _product.toBePurchsed = 0
            return Object.assign({}, state, { currentInventorySize: calculateInventorySpace(state) })

        case 'INCREMENT_SALE':
            if (state.playerInventory[_product.productId]) _product.toBeSold += 1
            return Object.assign({}, state, {})

        case 'DECREMENT_SALE':
            if (_product.toBeSold) _product.toBeSold -= 1
            return Object.assign({}, state, {})

        case 'HANDLE_SALE':
            if (_product.toBeSold) {
                state.cash += (_product.toBeSold * _product.price)
                state.playerInventory[_product.productId] -= _product.toBeSold
                _product.toBeSold = 0
            }
            return Object.assign({}, state, { currentInventorySize: calculateInventorySpace(state) })

        case 'HEAL':
            let healCost = (state.maxHealth - state.currentHealth) * 3
            let healAmount = state.maxHealth - state.currentHealth
            return Object.assign({}, state, { 
                cash: state.cash -= healCost, 
                currentHealth: state.currentHealth += healAmount
            })

        case 'RUN_ATTEMPT':
            let runHit = Math.floor(Math.random() * 6)
            return Object.assign({}, state, {
                runAwayHit: runHit, 
                runFight: fightRun(), 
                currentHealth: state.currentHealth -= runHit 
            })

        case 'CLOSE_FIGHT': 
            return Object.assign({}, state, { fightModal: false, tryFight: false })

        case 'FIGHT_ATTEMPT':
            // state.banditsHealth = state.bandits * 30
            // console.log(Math.round(Math.random() * state.playerMaxDamageDeal))
            let playerHit = Math.round(Math.random() * state.playerMaxDamageDeal)
            let banditHit = Math.round(Math.random() * (state.bandits * state.banditsMaxDamageDeal))
            return Object.assign({}, state, { 
                tryFight: true,
                currentHealth: state.currentHealth -= banditHit,
                banditsHealth: state.banditsHealth -= playerHit,
                playerHitAmount: playerHit,
                banditHitAmount: banditHit,
                runAwayHit: null
            })

        case 'TOGGLE_STORE':
            return Object.assign({}, state, { toggleSurplusStore: !state.toggleSurplusStore ? true : false})

        case 'PURCHSE_BODYARMOR': 
            _expansion.bodyArmor = true
            return Object.assign({}, state, { cash: state.cash -= 250, maxHealth: state.maxHealth += 25 })

        case 'PURCHSE_ARMORPLATING':
            _expansion.armorPlating = true
            return Object.assign({}, state, { cash: state.cash -= 600, maxHealth: state.maxHealth += 50 })

        case 'PURCHSE_TRENCHCOAT':
            _expansion.trenchCoat = true
            return Object.assign({}, state, { cash: state.cash -= 150, maxInventorySize: state.maxInventorySize += 15})

        case 'PURCHSE_BACKPACK': 
            _expansion.backPack = true
            return Object.assign({}, state, { cash: state.cash -= 250, maxInventorySize: state.maxInventorySize += 25})

        case 'PURCHSE_DUFFLEBAG':
            _expansion.duffleBag = true
            return Object.assign({}, state, { cash: state.cash -= 500, maxInventorySize: state.maxInventorySize += 50})

        case 'PURCHSE_RINGPOPS':
            _wepons.ringPops = true
            return Object.assign({}, state, { cash: state.cash -= 100, playerMaxDamageDeal: state.playerMaxDamageDeal += 5})

        case 'PURCHSE_SUGARCANE':
            _wepons.sugarCaneBat = true
            return Object.assign({}, state, { cash: state.cash -= 200, playerMaxDamageDeal: state.playerMaxDamageDeal += 10})
        
        case 'PURCHSE_NERF':
            _wepons.nerfPistol = true
            return Object.assign({}, state, { cash: state.cash -= 500, playerMaxDamageDeal: state.playerMaxDamageDeal += 15})

        case 'PURCHSE_BAZOOKA':
            _wepons.bazookaGum = true
            return Object.assign({}, state, { cash: state.cash -= 1000, playerMaxDamageDeal: state.playerMaxDamageDeal += 30})

        default: return state
    }
}