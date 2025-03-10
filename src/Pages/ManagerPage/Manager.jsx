import { useLocation } from "react-router-dom";

function Manager(){
    const location = useLocation(); 
    const userEmail = location.state?.email || "";
    return(
        <>
            <h1>this is manager page</h1>
            <h1>email:{userEmail}</h1>
            
        </>
    )
}

export default Manager;
