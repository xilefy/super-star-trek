const _ = require('lodash')
const Shield = require('./subsystems/Shield')

module.exports = class Player {
    constructor(input) {
        this.subsystems = {
            shield: new Shield()
        }

        this.input = input
        this.maxEnergy = 20000
        this.energy = this.maxEnergy
        this.isDocked = false
    }

    takeTurn() {
        let command = this.input('Enter command: ')
        switch (command) {
            case 'raise': {
                this.raiseShield()
                break
            }
            case 'transfer': {
                let energyAmount = parseInt(this.input('Enter amount to transfer: '))
                this.transferShield(energyAmount)
                break
            }
            case 'dock': {
                this.dock()
                break
            }
        }
    }

    damage(damageAmount) {
        let shield = this.subsystems.shield

        if (shield.isActive && !shield.isDamaged) {
            let damageToInflict = _.min([shield.energy, damageAmount])
            shield.energy -= damageToInflict
            damageAmount -= damageToInflict
        }

        if (damageAmount > 0) {
            let randomSubsystem = _.sample(this.subsystems)
            randomSubsystem.isDamaged = true
        }
    }

    dock() {
        this.energy = this.maxEnergy
        this.isDocked = true
    }

    raiseShield() {
        let shield = this.subsystems.shield
        if (!shield.isDamaged) {
            shield.isActive = true
        }
    }

    transferShield(energyAmount) {
        let shield = this.subsystems.shield
        let energyToTransfer = _.min([shield.maxEnergy - shield.energy, energyAmount])
        shield.energy += energyToTransfer
        this.energy -= energyToTransfer
    }
}
