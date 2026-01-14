import Resource from "../../DTO/Resource";
import Bundle from "../../DTO/Bundle";
import axios from "axios";

const BundleCollectionToResourcesList = async (bundle: Bundle): Promise<Resource[]> => {
    const resources: Resource[] = [];
    for (const entry of bundle.entry!) {
        if (entry.fullUrl) {
            const resource: Resource = (await axios.get(entry.fullUrl)).data;
            resources.push(resource);
        }
    }
    return resources;
}

export default BundleCollectionToResourcesList;