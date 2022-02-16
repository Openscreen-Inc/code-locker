import { useParams } from "react-router-dom";
import {createOwner, getAssetByScanId} from "../requests"
import {useEffect, useState} from "react";
import './product.css'
export default function Product() {
    let params = useParams();
    const scanId = params.id;
    const [isUnregistered, setIsUnregistered] = useState(false);
    const [asset, setAsset] = useState(null);
    const [contact, setContact] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(async ()=>{
        const res = await getAssetByScanId(scanId);

        console.log({data: res.data});
        setAsset(res.data.asset)
        if(!res.data.contact){
            setIsUnregistered(true);
        }
        else{
            setContact(res.data.contact)
        }

    }, [])



    if (!asset) return (
        <main style={{ padding: "1rem 0" , display: 'flex', flex: '1 1 0%', alignContent: 'space-around', flexDirection: 'column', flexWrap:'wrap'}}>
            <h1>Designed Brand Co.</h1>
            <h2>Registration and Authentication</h2>
        </main>
    )

    const registerOwner = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        const res = await createOwner(scanId, event.target.firstName.value, event.target.lastName.value, event.target.mobileNumber.value);
        console.log(res.data)
        setContact(res.data.contact.contact)
        setIsUnregistered(false)
        setIsLoading(false);
        console.log(contact);
    }

    return (
        <main style={{ padding: "1rem 0" , display: 'flex', flex: '1 1 0%', alignContent: 'space-around', flexDirection: 'column', flexWrap:'wrap'}}>
            <h1>Designed Brand Co.</h1>
            <h2>Registration and Authentication</h2>

                <h2>{asset?.name} {asset.customAttributes.uniqueItemNumber} </h2>
            {isUnregistered && <>
                <p> Congratulations on your purchase, to register please fill the form below!</p>
                <form onSubmit={registerOwner}>
                    <ul className="wrapper">
                        <li className="form-row">
                            <label>
                                First Name:
                                <input type="text" name="firstName" />
                            </label>
                        </li>
                        <li className="form-row">
                            <label>
                                Last Name:
                                <input type="text" name="lastName" />
                            </label>
                        </li>
                        <li className="form-row">
                            <label>
                                Mobile number:
                                <input type="text" name="mobileNumber" />
                            </label>
                        </li>
                        <li className="form-row">
                            <button type="submit" disabled={isLoading}>Submit</button>
                        </li>
                    </ul>
                </form>
            </>
            }
            {!isUnregistered && contact && <p>
                This product is registered to {contact.firstName} {contact.lastName}
            </p>}


        </main>
    );
}