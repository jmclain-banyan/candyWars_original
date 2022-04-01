import React from 'react';
import { useSelector, useDispatch } from 'react-redux';


export const CandyWarsApp = () => {
    const state = useSelector(state => state)
    return (
        <div className='app-wrapper'>
            <Header />
            {state.currentLocation[0].name !== 'Home' ? <Display /> : null}
            {console.log((!state.turnsLeft || !state.currentHealth))}
            {(!state.turnsLeft || state.currentHealth <= 0) ? <EndGame /> : <GamePlay />}
        </div>
    )
}

const Header = () => {
    return (
        <header>
            <h1>
                <span>Candy</span>
                <span>Wars</span>
            </h1>
        </header>
    )
}

const Display = () => {
    const state = useSelector(state => state)

    return (
        <div className='HUD-wrapper'>
            <div className='player-stats'>
                <p>Cash: <span>${state.cash}</span></p>
                <p>Health: <span>{state.currentHealth}</span> / {state.maxHealth}</p>
                <p>Inventory space: <span>{state.currentInventorySize}</span> / {state.maxInventorySize}</p>
                <p>Turns left: <span>{state.turnsLeft}</span></p>
                <p>Current Location: <span>{state.currentLocation[0].name}</span></p>
            </div>
            <PlayerInventory />
        </div>
    )
}

const PlayerInventory = () => {
    const state = useSelector(state => state)

    return (
        <ul className='player-inventory'>
            {
                Object.keys(state.playerInventory).map((x, k) => {
                    return (
                        <li key={k}> <span>{x}</span> : <span>{state.playerInventory[x]}</span></li>
                    )
                })
            }

        </ul>
    )
}

const GamePlay = () => {
    const state = useSelector(state => state)

    return (
        state.currentLocation[0].name === 'Home' ?
            <div>
                <StartGame />
                <LocationBtns />
            </div>
            :
            <div>
                <LocationBtns />
                <ShoppingBtns />
                <LocationMarket />
                {state.fightModal ? <FightModal /> : null}
                {state.toggleSurplusStore ? <StoreModal /> : null}
            </div>
    )
}

const StartGame = () => {
    return (
        <div>
            <p>The government has outlawed candy, and much like the last prohibition the people are still thirsty.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil minima perspiciatis dicta rem commodi suscipit quam delectus eligendi incidunt labore voluptate maxime quaerat inventore laudantium quis molestias, sequi eos reiciendis.</p>
            <h2>Are you ready?</h2>
        </div>
    )
}

const EndGame = () => {
    const state = useSelector(state => state)

    return (
        <div>
            <h3>Game Over</h3>
            <p>Your score: {Math.round(state.cash / 10)}</p>
        </div>
    )
}

const LocationBtns = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const changeLocation = e => dispatch({ type: 'UPDATE_LOCATION', location: e.target.name })

    let btns = state.locations.map((x, k) => {
        return (
            <button key={k}
                onClick={changeLocation}
                name={x.locationId}
                id={`${x.locationId}Btn`}>{x.name}</button>
        )
    })

    return (
        <div className='location-btns-wrapper'>
            {btns}
        </div>
    )
}

const ShoppingBtns = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const healAction = () => dispatch({ type: 'HEAL' })
    const toggleSurplusStore = () => dispatch({ type: 'TOGGLE_STORE' })

    return (
        <div className='shopping-btns-wrapper'>
            <button onClick={toggleSurplusStore}>Surplus Store</button>
            <button onClick={healAction}>Hospital || heal for ${(state.maxHealth - state.currentHealth) * 3}</button>
        </div>
    )
}

const LocationMarket = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const incrementPurchse = e => dispatch({ type: 'INCREMENT_PURCHSE', name: e.target.name })
    const decrementPurchse = e => dispatch({ type: 'DECREMENT_PURCHSE', name: e.target.name })
    const handlePurchse = e => dispatch({ type: 'HANDLE_PURCHSE', name: e.target.name })

    const incrementSale = e => dispatch({ type: 'INCREMENT_SALE', name: e.target.name })
    const decrementSale = e => dispatch({ type: 'DECREMENT_SALE', name: e.target.name })
    const handleSale = e => dispatch({ type: 'HANDLE_SALE', name: e.target.name })

    const productMarket = state.currentLocation[0].availibleProduct.map((x, k) => {
        return (
            <div key={k} className='product-wrapper'>
                <h3>{x.name}</h3>
                <span className='product-info'>Quanity: {x.quanity} || Price: ${x.price}</span>
                <div className='buy-wrapper'>
                    <button onClick={incrementPurchse} name={x.productId} className='incrementBtn fas fa-arrow-up'></button>
                    <input type='number' value={x.toBePurchsed} disabled />
                    <button onClick={decrementPurchse} name={x.productId} className='decrementBtn fas fa-arrow-down'></button>
                    {
                        state.cash >= (x.toBePurchsed * x.price) && (state.currentInventorySize + x.toBePurchsed) < (state.maxInventorySize + 1) ?
                            <span>
                                <button onClick={handlePurchse} name={x.productId} className='buyBtn actionBtn'>Buy</button>
                                <div className='buy-info'>Purchse @ ${x.toBePurchsed * x.price}</div>
                            </span>
                            :
                            <span>
                                <button className='buyBtn actionBtn' disabled>Buy</button>

                                <div className='buy-info'>Need more cash or space</div>
                            </span>
                    }

                </div>
                <div className='sale-wrapper'>
                    <button onClick={incrementSale} name={x.productId} className='incrementBtn fas fa-arrow-up'></button>
                    <input type='number' value={x.toBeSold} disabled />
                    <button onClick={decrementSale} name={x.productId} className='decrementBtn fas fa-arrow-down'></button>
                    {
                        x.toBeSold <= state.playerInventory[x.productId] ?
                            <span>
                                <button className='saleBtn actionBtn' onClick={handleSale} name={x.productId}>Sell</button>
                                <div className='sale-info'>Sell @ ${x.toBeSold * x.price}</div>
                            </span>
                            :
                            <span>
                                <button className='saleBtn actionBtn' disabled>Sell</button>
                                <div className='sale-info'>You don't have enough</div>
                            </span>
                    }
                </div>
            </div>
        )
    })

    return (
        <div className='market-container'>
            {productMarket}
        </div>
    )
}

const FightModal = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const attemptRun = () => dispatch({ type: 'RUN_ATTEMPT' })
    const closeFight = () => dispatch({ type: 'CLOSE_FIGHT' })
    const attemptFight = () => dispatch({ type: 'FIGHT_ATTEMPT' })

    return (
        <div className='fight-modal-container'>
            <div className='fight-modal'>
                {!state.runFight ?
                    <button className='fas fa-times fa-2x fight-modal-close' disabled></button>
                    : <button onClick={closeFight} className='fas fa-times fa-2x fight-modal-close'></button>}

                {!state.tryFight ?
                    <div>
                        <div className='fight-modal_health'>
                            <span>Bandits health = {state.banditsHealth}</span>
                            <span>Your health = {state.currentHealth}</span>
                        </div>
                        <p>You've been intercepted by {state.bandits} bandits</p>
                        {state.runAwayHit !== null ? <p>You took {state.runAwayHit} damage trying to run away</p> : null}
                    </div>
                    : <div>
                        <div className='fight-modal_health'>
                            <span>Bandits health = {state.banditsHealth}</span>
                            <span>Your health = {state.currentHealth}</span>
                        </div>
                        {state.runAwayHit === null ? <p>You attack and deal {state.playerHitAmount} damage to the bandits, they deal {state.banditHitAmount} damage to you.</p> : null}
                        {state.runAwayHit !== null ? <p>You took {state.runAwayHit} damage trying to get away</p> : null}
                    </div>}

                {state.banditsHealth <= 0 ?
                    <div>
                        <p>You won!</p>
                        <button onClick={closeFight}>Exit</button>
                    </div> : null}

                {state.runFight ?
                    <p>You successfully got away</p> : null}

                {!state.runFight ?
                    <div className='fight-action-btns'>
                        <button onClick={attemptFight}>
                            Fight <i className='fas fa-candy-cane'></i>
                        </button>
                        <button onClick={attemptRun}>
                            Run <i className='fas fa-running'></i>
                        </button>
                    </div>
                    : <div className='fight-action-btns'>
                        <button disabled>
                            Fight <i className='fas fa-candy-cane'></i>
                        </button>
                        <button disabled>
                            Run <i className='fas fa-running'></i>
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}



const StoreModal = () => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const _expansion = state.statsExpansion
    const _wepons = state.playerWepons

    const exitStore = () => dispatch({ type: 'TOGGLE_STORE' })
    const bodyArmor = () => dispatch({ type: 'PURCHSE_BODYARMOR' })
    const armorPlating = () => dispatch({ type: 'PURCHSE_ARMORPLATING' })
    const trenchCoat = () => dispatch({ type: 'PURCHSE_TRENCHCOAT' })
    const backPack = () => dispatch({ type: 'PURCHSE_BACKPACK' })
    const duffleBag = () => dispatch({ type: 'PURCHSE_DUFFLEBAG' })
    const ringPops = () => dispatch({ type: 'PURCHSE_RINGPOPS' })
    const sugarCane = () => dispatch({ type: 'PURCHSE_SUGARCANE' })
    const nerfPistol = () => dispatch({ type: 'PURCHSE_NERF' })
    const bazookaGum = () => dispatch({ type: 'PURCHSE_BAZOOKA' })

    return (
        <div className='store-modal-container'>
            <div className='store-modal'>
                <button className='fas fa-times fa-2x store-modal-close' onClick={exitStore}></button>
                {!_expansion.bodyArmor ?
                    <div>
                        <p>Body Armor +25 max health</p>
                        <button onClick={bodyArmor}>Buy $250</button>
                    </div>
                    :
                    <div>
                        <p>Body Armor equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
                {!_expansion.armorPlating ?
                    <div>
                        <p>Armor Plating +50 max health</p>
                        <button onClick={armorPlating}>Buy $600</button>
                    </div>
                    :
                    <div>
                        <p>Armor Plating Equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
                {!_expansion.trenchCoat ?
                    <div>
                        <p>Trench Coat +15 max inventory</p>
                        <button onClick={trenchCoat}>Buy $150</button>
                    </div>
                    :
                    <div>
                        <p>Trench Coat equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
                {!_expansion.backPack ?
                    <div>
                        <p>Backpack +25 max inventory</p>
                        <button onClick={backPack}>Buy $250</button>
                    </div>
                    :
                    <div>
                        <p>Backpack equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
                {!_expansion.duffleBag ?
                    <div>
                        <p>Duffle Bag +50 max inventory</p>
                        <button onClick={duffleBag}>Buy $500</button>
                    </div>
                    :
                    <div>
                        <p>Duffle Bag equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
                {!_wepons.ringPops ?
                    <div>
                        <p>Ring Pops +5 max damage</p>
                        <button onClick={ringPops}>Buy $100</button>
                    </div>
                    :
                    <div>
                        <p>Ring Pops equiped</p>
                        <button disabled> Already owned</button>
                    </div>}
                {!_wepons.sugarCaneBat ?
                    <div>
                        <p>Sugar Cane Bat +10 max damage</p>
                        <button onClick={sugarCane}>Buy $200</button>
                    </div>
                    :
                    <div>
                        <p>Sugar Cane Bat equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
                {!_wepons.nerfPistol ?
                    <div>
                        <p>Nerf Pistol +15 max damage</p>
                        <button onClick={nerfPistol}>Buy $500</button>
                    </div>
                    :
                    <div>
                        <p>Nerf Pistol equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
                {!_wepons.bazookaGum ?
                    <div>
                        <p>Bazooka Gum +30 max damage</p>
                        <button onClick={bazookaGum}>Buy $1000</button>
                    </div>
                    :
                    <div>
                        <p>Bazooka Gum equiped</p>
                        <button disabled>Already owned</button>
                    </div>}
            </div>
        </div>
    )
}