
const CONSTANTS = {
    STC_REGION_1 : 'STC Region 1',
    STC_REGION_2 : 'STC Region 2',
    STC_GOVERNANCE : 'STC Governance',
    CONTRACTOR_REGION : 'Contractor Region',
    CONTRACTOR_NOC : `Contractor NOC`,
    DISPUTE : 'Disputed',
    CLOSED : 'Closed'
}


const LIFE_CYCLE = [
    {
        stage: 'STC Region 1',
        value: {
            next: CONSTANTS.STC_GOVERNANCE,
            prev: CONSTANTS.CONTRACTOR_REGION
        },
    },
    {
        stage: 'STC Governance',
        value: {
            next: CONSTANTS.CLOSED,
            prev: CONSTANTS.DISPUTE
        },
    },
    {
        stage: 'Contractor Region',
        value: {
            next: CONSTANTS.STC_REGION_2,
            prev: null
        }
    },
    {
        stage: 'Contractor NOC',
        value: {
            next: CONSTANTS.STC_GOVERNANCE,
            prev: null
        },
    },
    {
        stage: 'STC Region 2',
        value: {
            next: CONSTANTS.STC_GOVERNANCE,
            prev: CONSTANTS.CONTRACTOR_NOC
        },
    },
]




export const getStatus = (currentState, step) => {
    const lifeCycleStage = LIFE_CYCLE.find((l) => l.stage === currentState);

    if (lifeCycleStage) {
        if (step === 'Yes'){
            return lifeCycleStage.value.next;
        } else {
            return lifeCycleStage.value.prev;
        }
    }
}