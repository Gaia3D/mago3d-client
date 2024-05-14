import CryptoJS from "crypto-js";

export const decrypt = (hash: string):string => {
    const decrypted = CryptoJS.TripleDES.decrypt(hash, "gaia3d");
    return decrypted.toString(CryptoJS.enc.Utf8);
}