import React from 'react'
import PropTypes from 'prop-types'

function StringIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m11.8819317 9.0917561c.3538537 0 .6392195.12819512.8473171.38282927.197561.24058536.2985366.56019513.2985366.95180483 0 .5259513-.1483903 1.0115122-.4407805 1.4435122-.2844878.4223415-.7296586.828-1.3249756 1.2099513l-.1589269.1009756-.5698536-.647122.1764878-.144c.3740488-.305561.6646829-.5918049.8631219-.8499512.0842927-.108.1510244-.2107317.2010732-.3073171-.2792195.0228293-.5566829-.089561-.7393171-.3125853-.1615609-.1931708-.2449756-.4416586-.2449756-.7358049 0-.31697563.1027317-.58214636.305561-.78585368.2037073-.20370732.468-.30643902.7867317-.30643902zm13.0309463 0c.3538537 0 .6400976.12819512.8481952.38282927.1975609.24058536.2985366.56019513.2985366.95180483 0 .5241952-.1483903 1.0106342-.4407805 1.4435122-.2836098.4214635-.7287805.827122-1.3249756 1.2099513l-.1589269.1009756-.5698536-.647122.1764878-.144c.3714146-.3038049.6620488-.5900488.864-.8508293.0842927-.108878.1510244-.2107317.2010731-.306439-.2932682.0219512-.5566829-.0886829-.7401951-.3125853-.161561-.1940488-.2449756-.4425366-.2449756-.7358049 0-.31873173.1027317-.58302441.305561-.78585368.2037073-.20370732.468-.30643902.7858536-.30643902zm6.8313952-8.21370732c.288 0 .5496585.01668293.7770731.05004878.2379513.0342439.4600976.09307317.6611708.17473171.2045853.08253658.3995122.19404878.5795122.33014634.0895609.06760976.180878.14487805.2721951.23092683l.2072195-.6515122h1.1177561v3.40507317h-1.224878l-.0298537-.18439024c-.2414634-1.4742439-1.0527805-2.19160976-2.4813659-2.19160976-.7832195 0-1.3495609.24409757-1.7297561.74634147-.2511219.32487805-.450439.76214634-.594439 1.29951219-.1457561.5452683-.2195122 1.15639025-.2195122 1.81492683 0 .62780488.0649756 1.21346342.1949269 1.73941464.126439.52243902.306439.96760975.5338536 1.32321951.2203903.34156097.4873171.59268293.7928781.74721951.3134634.15804878.7156097.23882927 1.1976585.23882927.7401951 0 1.3355122-.17560976 1.7675122-.52243903.4293658-.34331707.7050732-.86926829.8218536-1.56204878l.0298537-.18351219h1.1897561l-.0509268.26165854c-.2142439 1.10107317-.6453659 1.93521951-1.2801951 2.47873173-.6365854.5470244-1.5163903.8253658-2.6130732.8253658-1.2880976 0-2.3320976-.3819512-3.1047805-1.135317-.4618537-.45307322-.8183415-1.02468297-1.0606829-1.70078053-.2397073-.67082927-.3617561-1.42946342-.3617561-2.25482927 0-.92721951.1554146-1.77980488.4600975-2.53229269.3064391-.75951219.7472195-1.38204878 1.3100488-1.85092682.7173659-.59443903 1.6718049-.89648781 2.8378537-.89648781zm-25.79997076-.00035122 3.19434146 8.97629268 1.1247805.29326826v.9676098h-4.12858538v-.9684878l1.03609757-.2642927-.66819513-2.01512195h-3.28126829l-.69014634 2.01512195 1.04751219.2634146v.9693659h-3.57892682v-.9684878l1.152-.29414635 3.2347317-8.97453659zm13.05017556.13539512c.9904391 0 1.7719025.24848781 2.321561.73931708.2572683.23882926.4565854.51541463.5961951.82536585.143122.31346341.216.64273171.216.97639024 0 .28273171-.0509268.55756098-.1501463.81746342-.0992195.25551219-.2379512.48731707-.4153171.68926829-.1773658.20107317-.3889756.37053659-.6295609.50312195-.0465366.02546342-.0957074.05092683-.1448781.07287805.4539512.18087805.8332683.43814634 1.133561.76917073.4381463.48204878.6611707 1.08439025.6611707 1.79121951 0 .54878049-.144878 1.05804879-.4293658 1.51287805-.2853659.45307315-.6506342.79551215-1.0861464 1.01765855-.1387317.0693658-.288878.1281951-.4451707.1756097-.1589268.0482927-.342439.089561-.5452683.1211708-.2045854.0324878-.4355122.054439-.6927805.0702439-.2563902.0131707-.5505366.0193171-.8859512.0193171h-4.2330732v-.9676098l1.1282927-.28097561v-7.60302439l-1.1282927-.28185366v-.96760976zm-.3222439 5.44478049h-1.4979512v3.41209756h1.2582439c.396 0 .7164878-.02107317.9544391-.06321951.2230243-.04039024.4109268-.10360976.5575609-.18878049.2072195-.12204878.3731708-.30468293.5066342-.55668293.1352195-.25287804.2028292-.56546341.2028292-.9307317 0-.30643903-.0518048-.576-.1536585-.80253659-.1036097-.22565853-.2309268-.40039024-.3863415-.53297561-.1343414-.11151219-.3117073-.19580488-.5268292-.24936585-.2353171-.05882927-.5417561-.08780488-.9149269-.08780488zm-13.74998044-3.54661463-1.28195122 3.7387317h2.46556097zm13.76402924-.68119025h-1.512v3.00995122h1.4584391c.5610731 0 .972-.13434146 1.2231219-.40126829.1159024-.12380488.2195122-.28536585.3073171-.48292683.0860488-.19053659.1290731-.41531707.1290731-.66819512 0-.24321951-.0430243-.46448781-.1290731-.65590244-.0869269-.19317073-.1896586-.34946342-.3020488-.46185366-.2247805-.22565854-.6199024-.33980488-1.1748293-.33980488z" fill={fill} fillRule="evenodd" transform="translate(0 11)"/>
      </svg>
    </div>
  )
}

StringIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

StringIcon.defaultProps = {
  className: 'icon-string',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default StringIcon
