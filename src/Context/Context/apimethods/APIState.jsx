import React from "react";
import APIContext from "./APIContext";
import * as apiroute from "../API/ApiRouter";
import apiRequest from "../API/ApiRequest";


export const APIState = (props) => {

    const POSTFunction = (formdata, code) =>
        console.log("APIState - POSTFunction called with:", { formdata, code }) ||
        apiRequest({
            url: apiroute.host + code,
            method: "POST",
            body: formdata,
        });

    // POST Example to pass data
    // Example POST
    //APIFunction({ method: "POST", code: apiroute.savecategoryurl, formdata: { name: "Books" } });


    const GETWithBodyFunction = (code, formdata) =>
        apiRequest({
            url: apiroute.host + code,
            method: "GET",
            body: formdata,
        });


    const GETFunction = (code, formdata) =>
        apiRequest({
            url: apiroute.host + code,
            method: "GET",
            ...(Object.keys(params).length > 0 ? { params } : {}),

        });


    //Get Example to pass data

    // Case 1: Simple GET (no params)
    //GETFunction(apiroute.categoryurl);

    // Case 2: GET with params
    //GETFunction(apiroute.getcategoryurl, { cid: 5 });


    const PUTFunction = (data, code, useParams = false) =>
        apiRequest({
            url: apiroute.host + code,
            method: "PUT",
            ...(useParams ? { params: data } : { body: data }),
        });

    //PUT example to pass data

    // Case 1: Update category with formdata (body)
    //PUTFunction({ id: 1, name: "Books" }, apiroute.updatecategoryurl);

    // Case 2: Restore category with params
    //PUTFunction({ cid: 5 }, apiroute.restorecategoryurl, true);


    const DELETEFunction = (code, params = {}) =>
        apiRequest({
            url: apiroute.host + code,
            method: "DELETE",
            params
        });

    //Delete example to pass data

    // Delete with params
    //DELETEFunction(apiroute.deletecategoryurl, { cid: 5 });

    // Delete without params
    //DELETEFunction(apiroute.clearallurl);


    return (
        <APIContext.Provider value={{ POSTFunction, GETWithBodyFunction, GETFunction, PUTFunction, DELETEFunction }}>
            {props.children}
        </APIContext.Provider>
    )
}