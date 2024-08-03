const github = require ('github-profile')
github('unemallan@gmail.com')
    .then((profile)=>
    {console.log(profile)
})