import { AssetFinder } from "enkanetwork.js";

const wrapper = new AssetFinder();

const getHoyoAssetsfromURL = async (type, name) => {
  try {
    const url = await wrapper[type].toLink(name);

    return url;
  } catch (error) {
    console.error("Error processing the getHoyoAssets command:", error);
    return null;
  }
};

export { getHoyoAssetsfromURL };
