const rp = require('request-promise');
const csvReader = require('./csv/readCsvAndPassArray');
const p = console.log;


async function mainSofi() {
    const sofiOptions = {
      method: 'POST',
      uri: 'https://app.callmarker.com/api/v1/customers',
      body: {
        "token": "007b8c5fc2f0f3a554618d225748a728",
        "campaign": "3045",
        "customers": [
            {
                "name": "test dror",
                "last_name": "test",
                "source": "ורס דוגמs",
                "number": "0546989893",
                "custom_field_1682": "test",// hight
                "custom_field_1683": "test",// meukal
                "custom_field_1684": "test",// CC
                "custom_field_1685": "test",// id
            }
        ],
        "override": false,
      },
      json: true,
      headers: {
          "Content-Type": "application/json",
      },
    };
    try {
        const res = await rp(sofiOptions);
        p(res);
    } catch (error) {
        p(error);
    }
    
} 
mainSofi();



<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s){
    if(f.fbq)return;
    n=f.fbq=function(){
        n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);
    };
  if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '2647454978844190');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=2647454978844190&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->