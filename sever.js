import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/tiktok", async (req,res)=>{

    const url = req.query.url;
    if(!url) return res.json({error:"missing url"});

    try{

        const r = await fetch(url,{
            headers:{
                "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)"
            }
        });

        const html = await r.text();

        const match =
            html.match(/https:\/\/www\.tiktokv\.com\/redirect\/[\s\S]*?decode_once=1/);

        if(!match)
            return res.json({error:"redirect not found"});

        let link = match[0].replace(/&amp;/g,"&");

        function fullDecode(u){
            let prev;
            do{
                prev=u;
                try{u=decodeURIComponent(u);}catch{}
            }while(prev!==u);
            return u;
        }

        const decoded = fullDecode(link);

        const id =
            decoded.match(/user\/profile\/(\d+)/)?.[1];

        res.json({
            id,
            deep: decoded
        });

    }catch{
        res.json({error:"failed"});
    }

});

app.listen(3000,()=>{
    console.log("API running");
});