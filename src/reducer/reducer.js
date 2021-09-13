
import {
     SET_USER_BEGIN,
    SET_USER_DATA,
    SET_USER,
    SET_INPUT,
    USER_ERROR,
    REPOS,
    FOLLOWERS,
} from '../action'
const reducer = (state, action) => {


    
    if(action.type === SET_USER_DATA){
        const {mockUser,mockRepos,mockFollowers,remaining} = action.payload
 
        
      if(remaining === 0){
         return {...state,
             githubUser:mockUser,
            repos:mockRepos,
            followers:mockFollowers,
            requests:remaining,
            loading:false,
             error:{show:true, msg:'sorry you have exceeded your hourly rate limit'}
        }
      }

        return {
            ...state,
            githubUser:mockUser,
            repos:mockRepos,
            followers:mockFollowers,
            requests:remaining,
            loading:false,
        }
    }


    if(action.type ===  SET_USER_BEGIN){
        return{
            ...state,
            loading:true
        }
    }
  

    if(action.type === SET_USER){
          
        const response = action.payload
            return {
                ...state,
                githubUser:response.data,
                loading:false,
              
            }

    }

    if(action.type === REPOS){
       const repos = action.payload
        return {
            ...state,
             repos:repos.value.data,
            

        }
    }
    if(action.type === FOLLOWERS){
       const followers = action.payload
        return {
            ...state,
            followers:followers.value.data,

        }
    }

    if(action.type === USER_ERROR){
        return {
            ...state,
            loading:false,
            error:{show:true,msg:'there is no user with that username'}
        }
    }


        if(action.type === SET_INPUT){
          
            return {
                ...state,
                input:action.payload
            }
        }


}

export default reducer
