import ReactGA from "react-ga";

export const initGA = ()=> {  
    ReactGA.initialize("UA-142115498-1"); 
}

export const trackPage = (page) => {  
    ReactGA.pageview(page); 
}

export const trackEvent =(event) =>{
    ReactGA.event({
        category: event,
        action: event
    })
}