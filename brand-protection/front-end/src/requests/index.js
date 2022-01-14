import axios from 'axios';
const backendUrl = 'https://m7d4gmarsl.execute-api.us-east-1.amazonaws.com/dev/'
export async function getAssetByScanId(scanId){
    const res = await axios.get(`${backendUrl}id/${scanId}`);
    return res
}

export async function createOwner(scanId, firstName, lastName, mobileNumber){
    const res = await axios.post(`${backendUrl}id/${scanId}`,
        {
            firstName, lastName, mobileNumber
        });
    return res
}