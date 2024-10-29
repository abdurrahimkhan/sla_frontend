const ticketReducer = (state, action) => {
    switch (action.type) {
        case 'PROCESS_TICKET':
            if (state.ticketCount > 0) {
                return {
                    ...state,
                    ticketCount: state.ticketCount - 1
                };
            }
            return state;
        case 'UPDATE_TICKET_COUNT':
            return {
                ...state,
                ticketCount: action.payload
            };
        default:
            return state;
    }
};

export default ticketReducer;
