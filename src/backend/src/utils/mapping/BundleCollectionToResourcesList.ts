import Resource from "../../DTO/Resource";
import Bundle from "../../DTO/Bundle";
import axios from "axios";

const BundleCollectionToResourcesList = async (bundle: Bundle): Promise<Resource[]> => {
    const resources: Resource[] = [];
    for (const entry of bundle.entry!) {
        // If resource is already embedded, use it directly
        if (entry.resource) {
            resources.push(entry.resource);
        }
        // Only fetch if fullUrl is an actual HTTP URL (not urn:uuid:)
        else if (entry.fullUrl && (entry.fullUrl.startsWith('http://') || entry.fullUrl.startsWith('https://'))) {
            const resource: Resource = (await axios.get(entry.fullUrl)).data;
            resources.push(resource);
        }
    }
    return resources;
}

export default BundleCollectionToResourcesList;