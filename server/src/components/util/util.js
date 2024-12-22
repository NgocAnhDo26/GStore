import { cloudinary } from "../../config/config.js";

export const getUrl = (address) =>
  cloudinary.url(address, {
    fetch_format: "auto",
    quality: "auto",
  });

export const getImage = (public_id) => ({
  url: getUrl(public_id),
  public_id: public_id,
});
