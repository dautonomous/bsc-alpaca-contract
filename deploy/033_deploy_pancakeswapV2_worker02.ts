import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades, network } from 'hardhat';
import {
  PancakeswapV2RestrictedStrategyAddBaseTokenOnly__factory,
  PancakeswapV2RestrictedStrategyAddTwoSidesOptimal__factory,
  PancakeswapV2RestrictedStrategyLiquidate__factory,
  PancakeswapV2RestrictedStrategyWithdrawMinimizeTrading__factory,
  PancakeswapV2Worker,
  PancakeswapV2Worker02,
  PancakeswapV2Worker02__factory,
  PancakeswapV2Worker__factory,
  Timelock__factory,
} from '../typechain';
import MainnetConfig from '../.mainnet.json'
import TestnetConfig from '../.testnet.json'

interface IPancakeswapWorkerInput {
  VAULT_SYMBOL: string
  WORKER_NAME: string
  REINVEST_BOT: string
  POOL_ID: number
  REINVEST_BOUNTY_BPS: string
  REINVEST_PATH: Array<string>
  REINVEST_THRESHOLD: string
  WORK_FACTOR: string
  KILL_FACTOR: string
  MAX_PRICE_DIFF: string
  EXACT_ETA: string
}

interface IPancakeswapWorkerInfo {
  WORKER_NAME: string
  VAULT_CONFIG_ADDR: string
  WORKER_CONFIG_ADDR: string
  REINVEST_BOT: string
  POOL_ID: number
  VAULT_ADDR: string
  BASE_TOKEN_ADDR: string
  MASTER_CHEF_ADDR: string
  PANCAKESWAP_ROUTER_ADDR: string
  ADD_STRAT_ADDR: string
  LIQ_STRAT_ADDR: string
  TWO_SIDES_STRAT_ADDR: string
  MINIMIZE_TRADE_STRAT_ADDR: string
  REINVEST_BOUNTY_BPS: string
  REINVEST_PATH: Array<string>
  REINVEST_THRESHOLD: string
  WORK_FACTOR: string
  KILL_FACTOR: string
  MAX_PRICE_DIFF: string
  TIMELOCK: string
  EXACT_ETA: string
}

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
  const shortWorkerInfos: IPancakeswapWorkerInput[] = [{
    VAULT_SYMBOL: "ibBUSD",
    WORKER_NAME: "ORBS-BUSD PancakeswapWorker",
    REINVEST_BOT: "0xe45216Ac4816A5Ec5378B1D13dE8aA9F262ce9De",
    POOL_ID: 416,
    REINVEST_BOUNTY_BPS: '300',
    REINVEST_PATH: ['CAKE', 'BUSD'],
    REINVEST_THRESHOLD: '1',
    WORK_FACTOR: '5200',
    KILL_FACTOR: '7000',
    MAX_PRICE_DIFF: '11000',
    EXACT_ETA: '1626087600'
  }]












  const config = network.name === "mainnet" ? MainnetConfig : TestnetConfig
  const workerInfos: IPancakeswapWorkerInfo[] = shortWorkerInfos.map((n) => {
    const vault = config.Vaults.find((v) => v.symbol === n.VAULT_SYMBOL)
    if (vault === undefined) {
      throw(`error: unable to find vault from ${n.VAULT_SYMBOL}`)
    }

    const tokenList: any = config.Tokens
    const reinvestPath: Array<string> = n.REINVEST_PATH.map((p) => {
      const addr = tokenList[p]
      if (addr === undefined) {
        throw(`error: path: unable to find address of ${p}`)
      }
      return addr
    })

    return {
      WORKER_NAME: n.WORKER_NAME,
      VAULT_CONFIG_ADDR: vault.config,
      WORKER_CONFIG_ADDR: config.SharedConfig.WorkerConfig,
      REINVEST_BOT: n.REINVEST_BOT,
      POOL_ID: n.POOL_ID,
      VAULT_ADDR: vault.address,
      BASE_TOKEN_ADDR: vault.baseToken,
      MASTER_CHEF_ADDR: config.Exchanges.Pancakeswap.MasterChef,
      PANCAKESWAP_ROUTER_ADDR: config.Exchanges.Pancakeswap.RouterV2,
      ADD_STRAT_ADDR: config.SharedStrategies.Pancakeswap.StrategyAddBaseTokenOnly,
      LIQ_STRAT_ADDR: config.SharedStrategies.Pancakeswap.StrategyLiquidate,
      TWO_SIDES_STRAT_ADDR: vault.StrategyAddTwoSidesOptimal.Pancakeswap,
      MINIMIZE_TRADE_STRAT_ADDR: config.SharedStrategies.Pancakeswap.StrategyWithdrawMinimizeTrading,
      REINVEST_BOUNTY_BPS: n.REINVEST_BOUNTY_BPS,
      REINVEST_PATH: reinvestPath,
      REINVEST_THRESHOLD: ethers.utils.parseEther(n.REINVEST_THRESHOLD).toString(),
      WORK_FACTOR: n.WORK_FACTOR,
      KILL_FACTOR: n.KILL_FACTOR,
      MAX_PRICE_DIFF: n.MAX_PRICE_DIFF,
      TIMELOCK: config.Timelock,
      EXACT_ETA: n.EXACT_ETA,
    }
  })

  for(let i = 0; i < workerInfos.length; i++) {
    console.log("===================================================================================")
    console.log(`>> Deploying an upgradable PancakeswapV2Worker02 contract for ${workerInfos[i].WORKER_NAME}`);
    const PancakeswapV2Worker02 = (await ethers.getContractFactory(
      'PancakeswapV2Worker02',
      (await ethers.getSigners())[0]
    )) as PancakeswapV2Worker02__factory;
    const pancakeswapV2Worker02 = await upgrades.deployProxy(
      PancakeswapV2Worker02,[
        workerInfos[i].VAULT_ADDR,
        workerInfos[i].BASE_TOKEN_ADDR,
        workerInfos[i].MASTER_CHEF_ADDR,
        workerInfos[i].PANCAKESWAP_ROUTER_ADDR,
        workerInfos[i].POOL_ID,
        workerInfos[i].ADD_STRAT_ADDR,
        workerInfos[i].LIQ_STRAT_ADDR,
        workerInfos[i].REINVEST_BOUNTY_BPS,
        workerInfos[i].REINVEST_BOT,
        workerInfos[i].REINVEST_PATH,
        workerInfos[i].REINVEST_THRESHOLD
      ]
    ) as PancakeswapV2Worker02;
    await pancakeswapV2Worker02.deployed();
    console.log(`>> Deployed at ${pancakeswapV2Worker02.address}`);

    console.log(`>> Adding REINVEST_BOT`);
    await pancakeswapV2Worker02.setReinvestorOk([workerInfos[i].REINVEST_BOT], true);
    console.log("✅ Done");

    console.log(`>> Adding Strategies`);
    await pancakeswapV2Worker02.setStrategyOk([workerInfos[i].TWO_SIDES_STRAT_ADDR, workerInfos[i].MINIMIZE_TRADE_STRAT_ADDR], true);
    console.log("✅ Done");

    console.log(`>> Whitelisting a worker on strats`);
    const addStrat = PancakeswapV2RestrictedStrategyAddBaseTokenOnly__factory.connect(workerInfos[i].ADD_STRAT_ADDR, (await ethers.getSigners())[0])
    await addStrat.setWorkersOk([pancakeswapV2Worker02.address], true)
    const liqStrat = PancakeswapV2RestrictedStrategyLiquidate__factory.connect(workerInfos[i].LIQ_STRAT_ADDR, (await ethers.getSigners())[0])
    await liqStrat.setWorkersOk([pancakeswapV2Worker02.address], true)
    const twoSidesStrat = PancakeswapV2RestrictedStrategyAddTwoSidesOptimal__factory.connect(workerInfos[i].TWO_SIDES_STRAT_ADDR, (await ethers.getSigners())[0])
    await twoSidesStrat.setWorkersOk([pancakeswapV2Worker02.address], true)
    const minimizeStrat = PancakeswapV2RestrictedStrategyWithdrawMinimizeTrading__factory.connect(workerInfos[i].MINIMIZE_TRADE_STRAT_ADDR, (await ethers.getSigners())[0])
    await minimizeStrat.setWorkersOk([pancakeswapV2Worker02.address], true)
    console.log("✅ Done");

    const timelock = Timelock__factory.connect(workerInfos[i].TIMELOCK, (await ethers.getSigners())[0]);

    console.log(">> Timelock: Setting WorkerConfig via Timelock");
    const setConfigsTx = await timelock.queueTransaction(
      workerInfos[i].WORKER_CONFIG_ADDR, '0',
      'setConfigs(address[],(bool,uint64,uint64,uint64)[])',
      ethers.utils.defaultAbiCoder.encode(
        ['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],
        [
          [pancakeswapV2Worker02.address], [{acceptDebt: true, workFactor: workerInfos[i].WORK_FACTOR, killFactor: workerInfos[i].KILL_FACTOR, maxPriceDiff: workerInfos[i].MAX_PRICE_DIFF}]
        ]
      ), workerInfos[i].EXACT_ETA
    );
    console.log(`queue setConfigs at: ${setConfigsTx.hash}`)
    console.log("generate timelock.executeTransaction:")
    console.log(`await timelock.executeTransaction('${workerInfos[i].WORKER_CONFIG_ADDR}', '0', 'setConfigs(address[],(bool,uint64,uint64,uint64)[])', ethers.utils.defaultAbiCoder.encode(['address[]','(bool acceptDebt,uint64 workFactor,uint64 killFactor,uint64 maxPriceDiff)[]'],[['${pancakeswapV2Worker02.address}'], [{acceptDebt: true, workFactor: ${workerInfos[i].WORK_FACTOR}, killFactor: ${workerInfos[i].KILL_FACTOR}, maxPriceDiff: ${workerInfos[i].MAX_PRICE_DIFF}}]]), ${workerInfos[i].EXACT_ETA})`)
    console.log("✅ Done");

    console.log(">> Timelock: Linking VaultConfig with WorkerConfig via Timelock");
    const setWorkersTx = await timelock.queueTransaction(
      workerInfos[i].VAULT_CONFIG_ADDR, '0',
      'setWorkers(address[],address[])',
      ethers.utils.defaultAbiCoder.encode(
        ['address[]','address[]'],
        [
          [pancakeswapV2Worker02.address], [workerInfos[i].WORKER_CONFIG_ADDR]
        ]
      ), workerInfos[i].EXACT_ETA
    );
    console.log(`queue setWorkers at: ${setWorkersTx.hash}`)
    console.log("generate timelock.executeTransaction:")
    console.log(`await timelock.executeTransaction('${workerInfos[i].VAULT_CONFIG_ADDR}', '0','setWorkers(address[],address[])', ethers.utils.defaultAbiCoder.encode(['address[]','address[]'],[['${pancakeswapV2Worker02.address}'], ['${workerInfos[i].WORKER_CONFIG_ADDR}']]), ${workerInfos[i].EXACT_ETA})`)
    console.log("✅ Done");
  }
};

export default func;
func.tags = ['PancakeswapWorkers02'];