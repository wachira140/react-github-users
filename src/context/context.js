import React, { useContext, useEffect, useReducer} from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';
import reducer from '../reducer/reducer'
import {

    SET_USER_BEGIN,
    SET_USER_DATA,
    SET_USER,
    SET_INPUT,
    USER_ERROR,
    REPOS,
    FOLLOWERS,
    
} from '../action'

const initialState = {
    githubUser:[],
    repos:[],
    repo_url:'',
    folowers:[],
    input:'',
    requests:0,
    loading:true,
    error:{show:false, msg:''},
}

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();




export const GithubProvider = ({children})=>{
const [ state, dispatch] = useReducer(reducer, initialState)

const getData = ()=>{

    axios(`${rootUrl}/rate_limit`)
    .then(({data})=>{
        let {rate:{remaining},} = data
        dispatch({type:SET_USER_DATA, 
                    payload:{
                        mockUser,
                        mockRepos,
                        mockFollowers,
                        remaining
                    }})
    })
    .catch((err)=> console.log(err)
    )
}

const searchUser = async()=>{
    dispatch({type:SET_USER_BEGIN})
    const response = await axios(`${rootUrl}/users/${state.input}`)
    .catch(err=>dispatch({type:USER_ERROR}))
   
    if(response){
        dispatch({type:SET_USER,payload:response})


        const{login,followers_url} = response.data
        const repos = await axios(`${rootUrl}/users/${login}/repos?per_page=100`)
        const followers = await axios(`${followers_url}?per_page=100`)
     await Promise.allSettled([repos,followers])
        .then((results)=>{
            const [repos, followers] = results;

            const status = 'fulfilled';

            if(repos.status === status){
                dispatch({type:REPOS,payload:repos})
            }

            if(followers.status === status){
                dispatch({type:FOLLOWERS,payload:followers})
            }
        }).catch((err)=>console.log(err))
    }
}



const handleSubmit = (e)=>{
    e.preventDefault()
    searchUser()

}


const handleChange = (e)=>{
    const value = e.target.value
    dispatch({type:SET_INPUT, payload:value})
}


useEffect(()=>{
    getData()
},[])


    return (<GithubContext.Provider value={
        {
        
        ...state,
            handleSubmit,
            handleChange,
    }
    }>
        {children}
    </GithubContext.Provider>
    )
}
export const useGlobalContext = ()=>{
return useContext(GithubContext)
}

// export { GithubProvider, GithubContext }