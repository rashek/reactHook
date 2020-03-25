import { useReducer, useCallback } from 'react';

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error : null, data: null, extra: null, identifier: action.identifier};
        case 'RESPONSE':
            return {...httpState, loading: false, data: action.responseData, extra: action.extra};
        case 'ERROR':
            return{ loading: false, error: action.error};
        case 'CLEAR':
            return{ ...httpState, error: null};
        default:
            throw new Error ('Should not be here!`');
        }
    }

const useHttp = ()=> {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        loading: false, 
        error: null,
        data: null,
        extra: null,
        identifier: null
    });

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier)=> {
        dispatchHttp({type:'SEND', identifier: reqIdentifier });
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
            }
        ).then(responseData =>{
            return responseData.json();
            }).then(responseData => {
                dispatchHttp ({ type: 'RESPONSE', responseData: responseData, extra: reqExtra});
            }).catch(error => {
        dispatchHttp({type: 'ERROR', error: error.message});

    }) 
    },[])
return {
    isLoading: httpState.loading,
    data:httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    identifier: httpState.identifier
};

};

export default useHttp;