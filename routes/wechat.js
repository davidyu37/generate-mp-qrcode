const router = require('express').Router();
const axios = require('axios');

const getAccessToken = async () => {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.APP_ID}&secret=${process.env.APP_SECRET}`

  const { data } = await axios(url);

  return data;
}

router.get('/', (req, res) => {
  res.status(200).send('Wechat Service');
});

router.get('/qrcode', async (req, res) => {
  try {

    // Ideally, we would cache this access token before it expires, so we don't exceed the request limit
    const { access_token } = await getAccessToken();

    // If you don't want to exceed the limit and dont want to do the caching just yet. you can copy the access token from terminal and hardcode for now. Just remember to remove it
    console.log({access_token});

    // The sqaure QRCode. Permanently Valid and Limited Quantity(As of 05-30-2019, it's limited to 100,000) 
    const url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${access_token}`
    const params = {
      path: 'pages/index/index',
      width: 430,
    };
    
    // The circular QRCode. Permanently Valid and Limited Quantity(As of 05-30-2019, it's limited to 100,000)
    // const url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`
    // const params = {
    //   path: 'pages/index/index',
    //   width: 430,
    //   auto_color: false,
    //   line_color: { r: '000', g: '000', b: '000' },
    //   is_hyaline: false,
    // };

    // Permanently Valid and Unlimited Quantity
    // const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`
    // const params = {
    //   // Scene is essentially just extra parameters, which you can extract in onLoad of Mini-Program.
    //   // It's kind of confusing because scene means another thing in Mini-program
    //   scene: 'parameter_on_load',
    //   path: 'pages/index/index',
    //   width: 430,
    //   auto_color: false,
    //   line_color: { r: '000', g: '000', b: '000' },
    //   is_hyaline: false,
    // };

    const { data } = await axios({
      url,
      method: 'post',
      // Because Tencent return the image as buffer
      responseType: 'arraybuffer',
      data: params, 
    });
    
    res.type('png');
    res.status(200).end(data, 'binary');

  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
