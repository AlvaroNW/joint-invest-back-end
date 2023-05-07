import axios from "axios";
import { cryptoCache } from "../middleware/cache.js";

const middlewareToGetAPIcalls = async (req, res, next) => {
  try {
    const { remoteUrl, cacheKey } = req.body;
    const { data } = await axios.get(remoteUrl);
    if (data.status == "error") {
      console.log(data);
      res.send(data);
    }
    cryptoCache.set(cacheKey, data);
    console.log("using external api call -->", cacheKey);
    res.send(data);
  } catch (e) {
    next({ message: e.message });
  }
};

export { middlewareToGetAPIcalls };
