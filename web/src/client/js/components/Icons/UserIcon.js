import React from 'react'
import PropTypes from 'prop-types'

function UserIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 37 37">
        <path d="m17.0001939.48484849c9.1205272 0 16.5151516 7.39462434 16.5151516 16.51515151 0 4.4872607-1.8040531 8.6897652-4.9462979 11.7761643-.003619.0041781-.0071541.0076965-.0107202.0111934-3.0694145 3.0098555-7.179883 4.7281817-11.5578426 4.7281817-4.3792435 0-8.4887987-1.717831-11.55965826-4.7280605l-.01078412-.0116304-.27992327-.2816516c-2.96829005-3.0581402-4.66507673-7.1424061-4.66507673-11.4941969 0-9.12085242 7.39397988-16.51515151 16.51515148-16.51515151zm.0002909 22.36402421c-.4672482 0-.9295872.0279163-1.385166.0824847-.0180886.0018089-.0360989.0040103-.0540985.0062534l.0540985-.0062534c-.1110274.0132986-.2216533.0281802-.3318509.0446264l.2777524-.038373c-.1342177.0167257-.2678425.0357672-.4008267.0570918l.1230743-.0187188c-.1004108.0149857-.200466.0312703-.3001453.0488402l.177071-.0301214c-.1156136.0185392-.230743.038804-.345357.0607731l.168286-.0306517c-.1229214.0216666-.2452713.0452877-.3670115.0708373l.1987255-.0401856c-.1007591.0193134-.2011198.039944-.3010608.0618772l.1023353-.0216916c-.1038159.0217877-.2071885.0449779-.3100943.0695544l.207759-.0478628c-.112794.0247538-.2250534.0511669-.3367477.0792183l.1289887-.0313555c-.1158347.0276642-.2310779.057085-.3456959.0882394l.2167072-.0568839c-.1030792.0258877-.2056769.0531708-.3077694.0818327l.0910622-.0249488c-.1029275.0279768-.2053509.0573515-.3072458.0881076l.2161836-.0631588c-.1190894.0334338-.2374911.0687438-.3551671.105904l.1389835-.0427452c-.1008029.0304264-.2010885.0622048-.3008334.0953189l.1618499-.0525737c-.1039716.0328326-.2073767.0671095-.3101888.1028128l.1483389-.0502391c-.1105032.0366859-.2203427.0750112-.3294865.1149541l.1811476-.064715c-.1021551.0354752-.2037247.0723585-.3046832.1106323l.1235356-.0459173c-.1050005.0384266-.209357.0783503-.3130411.1197517l.1895055-.0738344c-.1014622.0384649-.2023071.0783341-.3025085.11959l.113003-.0457556c-.0975233.0389414-.1944517.07919-.2907614.1207296l.1777584-.074974c-.1054345.0434105-.2101565.0883561-.3141355.1348161l.1363771-.0598421c-.0922789.0398011-.1839897.0807875-.2751117.1229447l.1387346-.0631026c-.2130401.0951908-.4229611.1967385-.6295005.3044639-.0159944.0082998-.032053.0167219-.0480909.0251813l.0480909-.0251813c-.0895211.0466918-.178407.0945442-.2666362.1435425l.2185453-.1183612c-.2176649.11481-.4315312.2365019-.6412902.3648647-.1431419.0877112-.2845828.1785642-.4240063.2724647l-.2666659.1849091c-.0918909.0656908-.182843.1327378-.2728262.2011206-.131921.100444-.26186933.203666-.38963628.3096982-.12214219.1011509-.24204704.2048615-.35988566.311075-.05140026.0465681-.10245459.093421-.15310791.1407461l.15310791-.1407461c-.08058945.072639-.16021249.1464487-.23884289.2214111l.08573498-.080665c-.07074856.0660999-.14071484.133121-.20988018.2010505l.1241452-.1203855c-.07806465.074423-.15515089.1499822-.23123308.2266601l.10708788-.1062746c-.07550463.0741555-.15005478.1493935-.2236262.2256976l.11653832-.119423c-.08105809.0816928-.16097649.1646553-.23972419.2488663l.12318587-.1294433c-.08555435.0887321-.16978519.1789057-.25265436.2704948l.12946849-.1410515c-.07397327.0791055-.14691349.1593126-.21879494.240604l.08932645-.0995525c-.0756124.0835687-.15009117.1683159-.22340732.2542217l.13408087-.1546692c-.06845554.077417-.13595083.1558173-.20246364.2351858l.06838277-.0805166c-.07483186.0876818-.14845252.1765706-.22083118.2666454l.15244841-.1861288c-.07194954.085856-.14274944.1728449-.21237156.2609474l.05992315-.0748186c-.06786945.0844631-.13464683.169969-.20030673.2565003l.14038358-.1816817c-.07157308.0905714-.14190145.1823197-.21095458.2752241l.070571-.0935424c-.05878685.0774736-.11667794.1557692-.17365501.2348743l.10308401-.1413319c-.07111211.0956746-.14087179.1925752-.20924567.2906791l.10616166-.1493472c-.05512254.0765304-.10938959.1538185-.16278466.231853 2.62613129 2.3060376 5.99407609 3.6075191 9.56986469 3.6075191 3.4421468 0 6.6932793-1.2072115 9.2730888-3.3564113l.2953231-.2512291c-.1471719-.2151604-.3009777-.4246466-.461071-.6282222-.0295399-.0374588-.0592495-.0747636-.0891701-.1118661l.0891701.1118661c-.0689239-.0876439-.1390131-.1741924-.2102401-.2596264l.12107.1477603c-.079158-.0981587-.1597927-.1949021-.2418642-.2902026l.1207942.1424423c-.063281-.0759031-.12746-.1509266-.1925178-.2250571l.0717236.0826148c-.0715219-.0830505-.1441349-.1650054-.2178126-.2458465l.146089.1632317c-.0811417-.0924577-.1636503-.1835264-.2474881-.2731805l.1013991.1099488c-.0668369-.0733352-.1345498-.1457539-.2031192-.2172426l.1017201.1072938c-.0784085-.083848-.1579795-.1664587-.2386825-.247811l.1369624.1405172c-.0801203-.0835314-.1614098-.1657931-.2438369-.2467635l.1068745.1062463c-.074745-.0753465-.150461-.1496136-.2271234-.2227846l.1202489.1165383c-.1023407-.1005321-.2064352-.1990736-.3122231-.2955834l.1919742.1790451c-.0729843-.0696603-.1468264-.1383272-.2215052-.2059862l.029531.0269411c-.1341312-.1223673-.2709848-.2414682-.4104377-.3572188-.1277714-.1061312-.2576999-.2093504-.3897163-.309695-.0900615-.068384-.1809967-.1354312-.2728711-.2011223l-.2664385-.1849963c-.1394077-.0938989-.280834-.1847505-.42418-.2724873-.1390057-.0850142-.27988-.1671996-.4224707-.2463905-.0479484-.0267027-.0960708-.0529836-.1443836-.0789239l.1443836.0789239c-.099185-.0550847-.1992005-.1087205-.3000161-.1608867l.1556325.0819628c-.1042589-.0559791-.2094049-.1103724-.3154035-.1631562l.159771.0811934c-.0928686-.0480541-.1864161-.0948612-.2806188-.1404051l.1208478.0592117c-.0871503-.043398-.1748769-.085708-.2631607-.126917l.1423129.0677053c-.107246-.0518499-.2153412-.1020626-.3242506-.1506141l.1819377.0829088c-.0894197-.0417392-.179411-.0823488-.269954-.1218154l.0880163.0389066c-.1064614-.0474602-.2137008-.093333-.3216855-.1375963l.2336692.0986897c-.0989836-.0431456-.1986264-.084925-.2989027-.1253204l.0652335.0266307c-.089942-.0368675-.1804011-.0726184-.2713585-.1072396l.206125.0806089c-.1199991-.0483407-.2409053-.0946994-.3626739-.1390458l.1565489.0584369c-.1043364-.0397139-.2093284-.0779414-.3149474-.1146631l.1583985.0562262c-.1030398-.0375256-.2066972-.0736103-.3109451-.1082356l.1525466.0520094c-.1042634-.0362504-.2091377-.0710335-.3145957-.1043304l.1620491.052321c-.0999127-.0331854-.2003678-.0650302-.3013415-.0955183l.1392924.0431973c-.1176749-.0371543-.2360764-.0724583-.3551665-.1058858l.2158741.0626885c-.1021209-.0308345-.2047723-.0602812-.3079296-.0883233l.0920555.0256348c-.0976843-.0274192-.195832-.0535759-.2944218-.0784558l.2023663.052821c-.1182971-.0321577-.2372596-.0624683-.3568502-.0909065l.1544839.0380855c-.1111659-.0280536-.2228941-.0544838-.3351544-.0792701l.1806705.0411846c-.0997283-.0237149-.1998933-.0461278-.3004738-.0672238l.1198033.0260392c-.1032217-.0227906-.2068932-.0441914-.3109912-.0641864l.1911879.0381472c-.1233397-.0258697-.2473041-.0497591-.3718533-.0716413l.1806654.0334941c-.1049085-.0201506-.2102501-.0388734-.3160009-.056152l.1353355.0226579c-.0992959-.0174455-.1989636-.0336151-.2989829-.0484951l.1636474.0258372c-.1419296-.0231899-.2845961-.0437784-.4279417-.0617258l.2642943.0358886c-.1081001-.0160823-.2166109-.0306582-.3255072-.0437105l.0612129.0078219c-.4752578-.0595043-.9579793-.089978-1.4460514-.089978zm-7.42651336.2109248.14624715-.0944833c.03930535-.0250016.07873921-.0498011.11830004-.0743973.05283794-.0327415.10637287-.0655208.16013461-.0979286.04156046-.0251522.08292866-.0497853.12442856-.0741988.0381077-.0223274.0764774-.0446506.1149576-.0667862.0693395-.0399666.1390568-.0792493.2091257-.1179172.0502043-.0276393.1000352-.0547338.1500399-.0815177.0372683-.0200143.0749059-.0399443.1126402-.0596985.0530018-.0277055.1060011-.0550108.1591868-.0819695.0536499-.0272206.1076349-.0541291.1618073-.0806807.043499-.0213059.0865766-.042139.1297703-.0627465.0725518-.0346173.1462381-.0689613.2202513-.1026492.0227177-.0103572.0447543-.0203168.0668195-.0302182.0756603-.0339261.1523128-.0674705.2292995-.1003133.0410526-.0175599.0817468-.0346876.1225326-.0516192.0401823-.016622.0807946-.0332479.1214961-.0496794.064751-.0262134.1294923-.0517759.1944526-.0768465.179822-.0692973.3614353-.1349506.544623-.1967571.217075-.073397.4361442-.1411911.6572397-.2034713.0250318-.0068454.049766-.0137338.0745252-.0205531.0491598-.0137554.0987001-.027103.1483382-.0401741.0689099-.0179139.1376139-.0354209.2064995-.0523974.0336271-.0085337.0679273-.0168493.1022718-.0250332.0752516-.0176716.1502463-.0348587.2254444-.0514171.0704268-.0157839.141107-.0307618.2119602-.0451832.0228443-.0043607.0455484-.0089191.06827-.0134204.0972305-.0195632.1949484-.0378162.2929748-.0550091.0102713-.0014869.0209303-.0033428.031593-.0051861.0904955-.0159647.1808232-.0306445.2713987-.0444222.0376468-.0053914.0759529-.01105.1143024-.0165471.0658272-.0097783.1311661-.0186599.1966264-.0270716.0449991-.0054291.0906629-.0110609.1363844-.0164639.0784386-.0096295.1564441-.0181644.2346097-.0260309.0248306-.002128.0501415-.0046035.075469-.0070088.0874827-.008683.1748057-.0161284.2623151-.0227374.0427414-.0028448.0857799-.0058896.1288625-.0087318.0646591-.0046519.1291499-.0084475.193735-.0117878.0503817-.0022159.1009751-.0045509.1516246-.0066061.1845457-.0078803.3697765-.0116529.5556651-.0116529.1848863 0 .3691217.003732.5526219.0111384.0519291.0024669.1036056.0048459.1552215.0075156.0628922.0028864.1262316.0066062.1894764.0107628.0451474.0033255.0897359.0064763.134276.0098437.0844444.0060322.1692186.0132437.2538085.0212376.0292314.0031022.0582048.0059333.0871561.0088561.0731131.0070477.1461994.0150299.2191393.0235949.0523882.0064738.1047137.0129249.1569615.0196753.0574582.0071105.1147999.0148962.172045.0230419.0466617.0069436.0932944.0138249.1398613.0209447.0829145.0123836.1655785.0258145.2480262.0399951.0191163.0035703.0384629.0069397.0577975.0103503.0935686.0162323.1866194.0336643.2793775.0520492.0250399.0052248.0500371.0102514.0750127.015347.0662128.0132549.1321768.0272333.1979856.0416931.0744444.0165962.1491913.0336812.2237301.0513863.0403549.0093555.0806098.0191156.1208029.0290565.0611476.015346.1219002.0308192.182507.0467046.0543523.0140354.108668.0286382.1628636.0435719.0246131.0069842.0493449.0138732.0740513.020831.3762856.1057996.7465125.2276991 1.1099953.3649523.0306199.0116983.0608943.023254.0911213.0349162.0523931.0200837.1048269.0406931.1571146.0616228.0574327.0231097.1149474.046589.1722805.0704559.0513019.0212437.102051.0427389.1526544.0645378.0500736.0216782.1000805.0435775.1499419.0657735.0406397.017988.0813076.0363341.1218769.0548774.0759481.0348111.1514922.0701865.2266826.1062464.0247797.0117937.0494552.0237208.0740921.0357217.066809.0326292.1334394.065765.1997794.0994404.0482575.0244156.0962582.0491455.1441034.074158.0515103.0270059.1029173.0543018.1541406.0819244.0518712.0278979.1035292.0561922.1549958.0848188.0314954.0175899.0628922.035217.0942169.0529679.2514952.1424455.4984685.2930274.740414.4513452l.0393934.0259394c.1047276.0690487.2085054.1395514.3113033.2114875.2064494.1444014.4089613.2946602.6072762.4505326.0535873.0421928.1070751.0848887.1602495.1279945.0280802.0226868.0555213.0451117.0828777.0676459.0597575.0493001.1196638.0995135.1791512.1502538.0263254.0223714.0520543.0444851.0777037.0666974.137926.1195247.2739399.2421796.4075513.3676433.0488254.0457506.0971491.0917992.1451498.138217.0419613.0406804.083666.0815316.1251211.1226627.0286409.0283106.0572973.0569959.0858324.0858153.0586531.0593477.1166518.1190067.174132.1792243.020094.0209402.0400765.0420082.0599956.0631439.0564485.0600068.1125147.1205854.1680611.1817043.0261307.0286393.0520167.0573666.0777878.0862117.2543974.2848483.4977272.5812137.7290394.8885047.0473083.0627586.0943015.1263232.1407803.1903434l.2457674-.292486c2.0948131-2.560147 3.2718468-5.771352 3.2718468-9.1713752 0-8.01595767-6.4991939-14.51515152-14.5151516-14.51515152-8.01658277 0-14.51515148 6.49884927-14.51515148 14.51515152 0 3.53053 1.26914446 6.8577424 3.51690891 9.4638612l.00653024-.0094609c.20318942-.2792646.41615939-.5498362.63831768-.8113093.02995314-.0348983.0595294-.0693591.08926552-.1036595.0434431-.0504547.08766776-.1007167.13223573-.1506263.02711212-.030035.05418236-.0600822.08137722-.0899999.05545988-.0613283.1115397-.1219067.16813088-.181939.02001949-.0209346.04000607-.0420029.06005573-.0630034.05731798-.0603316.11532966-.1199902.17385096-.1790843.02890355-.0289025.05756526-.0575882.08634727-.0861389.04111239-.0410593.08282587-.08191.12478588-.1224786.04823044-.0463642.09656237-.0924133.1452128-.1380904.13361413-.1256979.26965346-.2483504.4080021-.3681306.0254474-.0218024.05117988-.0439162.07699122-.0659308.0598258-.0512462.11974228-.1014584.18007031-.1511387.02698226-.0220072.05442688-.0444322.08195552-.0667474.05355834-.0436199.10705478-.0863146.16085981-.128596.19830227-.1556435.40083542-.3059024.60732034-.4503809.1026482-.07198.20643986-.1424798.31118108-.2115256zm7.42622246-17.72646417c3.7652 0 6.8181819 3.05263042 6.8181819 6.81818187 0 3.7648908-3.0532911 6.8181818-6.8181819 6.8181818s-6.8181818-3.053291-6.8181818-6.8181818c0-3.76555145 3.0529819-6.81818187 6.8181818-6.81818187zm0 2c-2.660682 0-4.8181818 2.15725146-4.8181818 4.81818187 0 2.6603213 2.1578605 4.8181818 4.8181818 4.8181818 2.6603214 0 4.8181819-2.1578605 4.8181819-4.8181818 0-2.66093041-2.1574999-4.81818187-4.8181819-4.81818187z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
      </svg>
    </div>
  )
}

UserIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

UserIcon.defaultProps = {
  className: 'icon-user',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#F2F2F2' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default UserIcon
