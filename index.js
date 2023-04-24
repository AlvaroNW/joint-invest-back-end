
import Express, { Router } from "express";

const app = Express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Backend for Joint Invest - from the Beehive with &#x2764;&#xFE0F;!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})