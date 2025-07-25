import { Games } from "../types/types";

const games:Games = {}
const accountActivationIds:Array<string> = new Array();
const passwordResetIds:Array<string> = new Array();


export default function getGames():Games {
    return games
}

export function deleteAllGames(){
    Object.keys(games).forEach(game => delete games[game]);
}


export const addAccountActivationId = (id:string) => {
    accountActivationIds.push(id);
}

export const accountActivationIdExists = (id:string):boolean => {
    if(accountActivationIds.find(i => i === id) === undefined){
        return false;
    }
    return true;
}

export const deleteAccountActivationId = (id:string) => {
    const index = accountActivationIds.indexOf(id);
    if(index !== -1){
        accountActivationIds.splice(index, 1);
    }
}

export const getPasswordResetIds = ():Array<string> => {
    return passwordResetIds;
}

export const addPasswordResetId = (id:string) => {
    passwordResetIds.push(id);
}

export const passwordResetIdExists = (id:string):boolean => {
    if(passwordResetIds.find(i => i === id) === undefined){
        return false;
    }
    return true;
}

export const deletePasswordResetId = (id:string) => {
    const index = passwordResetIds.indexOf(id);
    if(index !== -1){
        passwordResetIds.splice(index, 1);
    }
}