const express = require();

const index = express()
const port = process.env.PORT || 300

index.listen(port, () => {
    console.log('server started on ' + port)
})
