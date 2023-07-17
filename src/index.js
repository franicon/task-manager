const express = require('express');

const index = express()
const PORT = process.env.PORT || 3000

index.listen(PORT, () => {
    console.log('server started on port ' + PORT)
})
