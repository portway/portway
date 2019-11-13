import React from 'react'
import PropTypes from 'prop-types'

function TeamsIcon({ className, fill, height, width }) {
  // xmlns="http://www.w3.org/2000/svg"
  return (
    <div className="icon">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 36 36">
        <path d="m16.5146 0c9.1211201 0 16.516 7.39455065 16.516 16.515 0 6.9030292-4.2361549 12.8177777-10.2505652 15.285918-.0448358.0226364-.0916817.0418375-.1401419.0574414-1.8946751.7563981-3.9614137 1.1726406-6.1252929 1.1726406-2.1615093 0-4.2260093-.4153432-6.1180794-1.1705698-.0506771-.0155435-.099827-.0354831-.1468624-.0590223-6.01385332-2.4685044-10.2490582-8.3831201-10.2490582-15.2864079 0-9.12079101 7.39322143-16.515 16.514-16.515zm.0008 19.3366c-1.8705601 0-3.5455249 1.0797714-4.3433187 2.7434013l-.1095906.2460947c-.2403453.5805236-.3658907 1.1969982-.3658907 1.829504l-.0004267 6.0562762c1.5076859.5305442 3.1293593.8191238 4.8184267.8191238 1.6891562 0 3.3109697-.2885984 4.8188216-.8191681l-.0003216-6.0575319c0-.7893279-.1922776-1.5512937-.5553722-2.2392176-.8285691-1.5740396-2.4555644-2.5784824-4.2623278-2.5784824zm-8.4358 2.087c-1.81180076 0-3.34630398 1.2693538-3.73356956 3.0067185 1.33762102 2.0521003 3.17943546 3.7447668 5.34981454 4.9021503l.00075502-5.1768688c0-.744947.12267487-1.4742439.3579713-2.1689295l-.20093653-.1154802c-.54355281-.2912067-1.14732762-.4475903-1.77403477-.4475903zm16.8695-.2793c-.7386021 0-1.4438524.2144365-2.0547126.6081881l.1015496.2876012c.2218036.6762343.337163 1.3876669.337163 2.1142107l.0002577 5.1784244c2.1925834-1.1689761 4.0500058-2.8840882 5.3906318-4.9636695-.3006624-1.8424263-1.8815283-3.2247549-3.7748895-3.2247549zm-8.4345-19.1443c-8.01614926 0-14.514 6.4987187-14.514 14.515 0 2.0052864.40660048 3.9156512 1.14185048 5.6531067 1.03333256-1.6569731 2.8654535-2.7445067 4.93714952-2.7445067 1.0294407 0 2.0168816.2748626 2.8871278.7785494 1.2561536-1.7663057 3.3026979-2.8655494 5.5486722-2.8655494 2.1585208 0 4.1367632 1.0135985 5.4051997 2.6671508.9011136-.5551965 1.9409848-.8594508 3.0285003-.8594508 2.1247861 0 3.9899033 1.1412619 5.0081022 2.8593429.6916684-1.692386 1.0733978-3.5459923 1.0733978-5.4886429 0-8.01585992-6.4994294-14.515-14.516-14.515zm-8.4352 9.721c1.9332847 0 3.5 1.5667153 3.5 3.5s-1.5667153 3.5-3.5 3.5c-1.93328475 0-3.5-1.5667153-3.5-3.5s1.56671525-3.5 3.5-3.5zm16.8701 0c1.9332847 0 3.5 1.5667153 3.5 3.5s-1.5667153 3.5-3.5 3.5c-1.9325683 0-3.5-1.5669987-3.5-3.5s1.5674317-3.5 3.5-3.5zm-16.8701 2c-.82871525 0-1.5.6712847-1.5 1.5s.67128475 1.5 1.5 1.5 1.5-.6712847 1.5-1.5-.67128475-1.5-1.5-1.5zm16.8701 0c-.8281225 0-1.5.6716919-1.5 1.5s.6718775 1.5 1.5 1.5c.8287153 0 1.5-.6712847 1.5-1.5s-.6712847-1.5-1.5-1.5zm-8.4346-6.1728c2.485586 0 4.5 2.01401643 4.5 4.5 0 2.4852847-2.0147153 4.5-4.5 4.5-2.4859836 0-4.5-2.014414-4.5-4.5 0-2.48628475 2.0137153-4.5 4.5-4.5zm0 2c-1.3817153 0-2.5 1.1182847-2.5 2.5 0 1.3811049 1.1186743 2.5 2.5 2.5 1.3807153 0 2.5-1.1192847 2.5-2.5 0-1.3813257-1.1188951-2.5-2.5-2.5z" fill={fill} fillRule="evenodd" transform="translate(1 1)"/>
      </svg>
    </div>
  )
}

TeamsIcon.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

TeamsIcon.defaultProps = {
  className: 'icon-teams',
  fill: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#e5e7e6' : '#3b3d3e',
  height: '18',
  width: '18'
}

export default TeamsIcon
