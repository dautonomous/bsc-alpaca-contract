import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, network } from 'hardhat';
import { OracleMedianizer__factory } from '../typechain'
import TestnetConfig from '../.testnet.json'
import MainnetConfig from '../.mainnet.json'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
  ░██╗░░░░░░░██╗░█████╗░██████╗░███╗░░██╗██╗███╗░░██╗░██████╗░
  ░██║░░██╗░░██║██╔══██╗██╔══██╗████╗░██║██║████╗░██║██╔════╝░
  ░╚██╗████╗██╔╝███████║██████╔╝██╔██╗██║██║██╔██╗██║██║░░██╗░
  ░░████╔═████║░██╔══██║██╔══██╗██║╚████║██║██║╚████║██║░░╚██╗
  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║██║░╚███║██║██║░╚███║╚██████╔╝
  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░╚══╝░╚═════╝░
  Check all variables below before execute the deployment script
  */
  const DEFAULT_MAX_PRICE_DEVIATION = '1000000000000000000'
  const DEFAULT_MAX_PRICE_STALE = '86400'
  const config = network.name === "mainnet" ? MainnetConfig : TestnetConfig

  const TOKEN0_SYMBOLS = [
    'CAKE',
    'BTCB',
    'ETH',
    'USDT',
    'WBNB',
    'DOT',
    'LINK',
    'YFI',
    'VAI',
    'USDC',
    'DAI',
    'BTCB',
    'USDT',
    'CAKE',
    'ETH',
    'UNI',
    'XVS',
    'UST',
    'COMP',
    'SUSHI',
    'ITAM',
    'ALPACA',
    'bMXX',
    'BELT',
    'BOR',
    'BRY',
    'pCWS',
    'SWINGBY',
    'DODO',
    'ODDZ',
    'ALPACA',
    'WEX',
    'WEX',
    'ETH',
    'ALPACA',
    'BETH',
    'WAULTx',
    'BTCB',
    'ADA',
    'MATIC',
    'FORM',
    'CAKE',
    'USDC',
    'TUSD',
    'TRX',
    'BTT',
    'ORBS',
    'ETH',
  ];
  const TOKEN1_SYMBOLS = [
    'WBNB',
    'WBNB',
    'WBNB',
    'BUSD',
    'BUSD',
    'WBNB',
    'WBNB',
    'WBNB',
    'BUSD',
    'BUSD',
    'BUSD',
    'BUSD',
    'WBNB',
    'BUSD',
    'BUSD',
    'WBNB',
    'WBNB',
    'BUSD',
    'ETH',
    'ETH',
    'WBNB',
    'BUSD',
    'WBNB',
    'WBNB',
    'WBNB',
    'WBNB',
    'WBNB',
    'WBNB',
    'WBNB',
    'WBNB',
    'USDT',
    'WBNB',
    'USDT',
    'BTCB',
    'WBNB',
    'ETH',
    'WBNB',
    'WBNB',
    'WBNB',
    'USDT',
    'BUSD',
    'USDT',
    'USDT',
    'BUSD',
    'WBNB',
    'WBNB',
    'BUSD',
    'USDT',
  ];
  const MAX_PRICE_DEVIATIONS = [
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
    DEFAULT_MAX_PRICE_DEVIATION,
  ];
  const MAX_PRICE_STALES = [
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
    DEFAULT_MAX_PRICE_STALE,
  ]
  const SOURCES = [
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.ChainLinkOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.SimpleOracle],
    [config.Oracle.ChainLinkOracle],
  ];





  



  const tokenList: any = config.Tokens
  const token0Addrs: Array<string> = TOKEN0_SYMBOLS.map((t) => {
    const addr = tokenList[t]
    if (addr === undefined) {
      throw(`error: token: unable to find address of ${t}`)
    }
    return addr
  })
  const token1Addrs: Array<string> = TOKEN1_SYMBOLS.map((t) => {
    const addr = tokenList[t]
    if (addr === undefined) {
      throw(`error: token: unable to find address of ${t}`)
    }
    return addr
  })

  const oracleMedianizer = OracleMedianizer__factory.connect(config.Oracle.OracleMedianizer, (await ethers.getSigners())[0]);
  console.log(">> Adding primary source to oracle medianizer");
  await oracleMedianizer.setMultiPrimarySources(token0Addrs, token1Addrs, MAX_PRICE_DEVIATIONS, MAX_PRICE_STALES, SOURCES, { gasLimit: '10000000' });
  console.log("✅ Done")
};

export default func;
func.tags = ['AddSourceOracleMedianizer'];