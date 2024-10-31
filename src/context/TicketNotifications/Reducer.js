const ticketReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_TICKET_STATS':
            return {
                ...state,
                mttrCount: action.payload.mttrCount,
                ptlCount: action.payload.ptlCount
            };
        default:
            return state;
    }
};

export default ticketReducer;
