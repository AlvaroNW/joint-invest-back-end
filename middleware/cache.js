import Cache from "node-cache";
//-1 to persist forever
const cacheLifeInSeconds = 60 * 120;

//This object is the Cache itself, you need to import it to get, set, or check data
const cryptoCache = new Cache({ stdTTL: cacheLifeInSeconds });

//this is th middleware that use the cache that we just created
const cacheMiddelware = (req, res, next) => {
  try {
    const { cacheKey } = req.body;
    if (cryptoCache.has(cacheKey)) {
      console.log("use manual cache! --->", cacheKey);
      return res.send(cryptoCache.get(cacheKey));
    }
    return next();
  } catch (e) {
    next({ message: e.message });
  }
};
export { cacheMiddelware, cryptoCache };
