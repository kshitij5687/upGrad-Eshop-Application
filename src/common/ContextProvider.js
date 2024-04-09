import React, { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = (props) => {
    const [id, setId] = useState("");
    const [quantity, setQuantity] = useState();
    const [token, setToken] = useState();
    const [products, setProducts] = useState([]);


    const contextValue = {
        setId,
        id,
        quantity,
        setQuantity,
        token,
        setToken,
        products,
        setProducts
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}

export default ContextProvider;
