const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const axios = require('axios');
const mailer = require('nodemailer');
const fs = require('fs');

// server config
const port = 5000;

// service data
const model = {
    normal: {
        size44: {
            url: "MX5C2KH%2FA",
            name: "MX5C2KH/A"
        },
        size40: {
            url: "MX5M2KH%2FA",
            name: "MX5M2KH/A"
        }
    },
    black: {
        size44: {
            url: "MWWM2KH%2FA",
            name: "MWWM2KH/A"
        },
        size40: {
            url: "MWXA2KH%2FA",
            name: "MWXA2KH/A"
        }
    }
}

// mail config
const time = 1000 * 60 * 30; // 30분
const fromEmail = {
    user: "ProjectAppleWatchNotice@gmail.com",
    pass: "zxcv1234##"
}
let toMails = {
    size44: [],
    size40: []
};

router.get('/', (req, res, next) => {
    
    if(req.query.email == null || req.query.size == null)
        return console.log("invalid request");

    const email = req.query.email;
    const size = req.query.size;
    const index = toMails["size" + size].indexOf(email);
    
    let result = false;
    if(index != -1) {
        result = false;
    } else {
        toMails["size" + size].push(email);
        fs.writeFile("./log/[" + email + "]-[" + size + "]" + ".txt", new Date() + "\n" + email, 'utf8', (err) => {
            if(err)
             console.error(err);
        });
        result = true;
    }

    res.json({ email, size, result });
});

// client-side react render
app.use(express.static(__dirname + '/build'));

const corsConfig = { origin: '*', credentials: false };
app.use(cors(corsConfig));
app.use('/api', router);
app.listen(port, () => {
    console.log(`run node server port: ${port}`);
});

async function main() {
    let buyable44 = await getBuyable(44);
    let buyable40 = await getBuyable(40);
    
    if(buyable44) {
        for(let i in toMails.size44) {
            sendMail(toMails.size44[i], "애플워치 5 에르메스 블랙 에디션 44mm 가 애플 코리아 공식 홈페이지에서 판매를 시작했습니다!", 44);
        }
    }

    if(buyable40) {
        for(let i in toMails.size40) {
            sendMail(toMails.size40[i], "애플워치 5 에르메스 블랙 에디션 40mm 가 애플 코리아 공식 홈페이지에서 판매를 시작했습니다!", 40);
        }
    }
            
    setTimeout(main, time);
}
main();

async function getBuyable(sizeNum) {
    const size = "size" + sizeNum;
    const url44 = "https://www.apple.com/kr/shop/delivery-message?parts.0=" + model.black[size].url +  "&geoLocated=false&option.0=&_=";
    const requestUrl = url44 + new Date().getTime();
    try {
      let result = await axios.get(requestUrl);
      return result.data.body.content.deliveryMessage[model.black[size].name].isBuyable;
    } catch(e) {
      console.error(e);
      sendMail("lch8798@gmail.com", "Error!!!!!!!!!!!!!");
      throw e;
    }
}

function sendMail(toAddress, text, size) {
    let mail = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gamil',
        auth: fromEmail
    });

    let submitConfig = {
        from: fromEmail.user,
        to: toAddress,
        subject: "apple watch Test",
        text
    }

    mail.sendMail(submitConfig, (err, info) => {
        if(err) {
            console.error(err);
        } else {
            if(text.indexOf("Error") != -1) 
                return console.error("Error: " + new Date());

            console.log("mail send- [ " + toAddress + " ] - " + info.response);
            toMails["size" + size].splice(toMails["size" + size].indexOf("toAddress"), 1);
        }
    });
}