import ImageKit from "imagekit";

console.log("ENV CHECK", process.env.IMAGEKIT_URL_ENDPOINT); // debug lin

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_PRIVATE_KEY
});

export default imagekit;