

export default function reducer(state = {
    isSignedIn: false,
    userInfo:{},
}, action) {
    switch (action.type) {     
        case "STORE_USER":{
            return{
                ...state,
                isSignedIn:true,
                userInfo: action.payload
            }
        }
        case "SIGN_OUT":{
            return{
                ...state,
                isSignedIn:false,
                userInfo: {},
            }
        }    
        default: {
            return state
        }
    }

}