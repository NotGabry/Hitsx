const update = async () => {
    if (window.location.origin) {
        let f = await fetch(`https://hitsx.up.railway.up/api/refresh`, {
            method: `POST`,
            body: {
                Password: process.env.Password,
                ID: window.location.origin
            } 
        }).then(res => res.json())
    
        if (f.success) return
        else console.log(`Hitsx Error -> ${f.message}`)
    } else console.log(`Hitsx Error -> Impossible to find some information about this website`)
};

update()