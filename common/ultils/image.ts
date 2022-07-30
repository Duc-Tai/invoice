import axios from "axios";
import { $localForage } from "~/plugins/localforage.client";

export async function updateImage(url: string, method: string, data: any) {
    return new Promise(async (resolve, reject) => {
        var config = {
            method: method,
            url: `${window.location.origin}/${url}`,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: data,
        };
        //@ts-ignore
        await axios(config)
            .then(function (response: any) {
                console.log('response :>> ', response);
                const data = response.data
                resolve(data)
            })
            .catch(function (error: any) {
                console.log('error :>> ', error);
                reject(error)
            });
    })
}