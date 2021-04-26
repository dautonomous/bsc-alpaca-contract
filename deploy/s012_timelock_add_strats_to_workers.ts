import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { Timelock__factory } from '../typechain'

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

  const STRATEGY = '0x11aFF2AC27CBb158015fb3F8FD7661F7f8573BD7'
  const WORKERS = [
    '0x2c12663339Fdce1A3088C0245FC2499255ccF7eC',
    '0xf20E73385397284f37c47963E2515156fCf33360',
    '0xA950ee51Ac3b27a1a6C87D6448D6717ACBc7b0A8',
    '0x8Da719444090875B476A7163F8A363fB30F2440c',
    '0x09207DF4c9D3E62346997e39526fb0e46Ce45539',
    '0x87501549129FB8A960F870CCcDc0153D8b926b4E',
    '0x9d25cEec06a6A732c8647BA717f986Bf67794a80',
    '0xF4964FDD35D9443b766adD8bdEb98C4E8592a7ea',
    '0x933d7fABE41cBc5e9483bD8CD0407Cf375a8e0C3',
    '0xDf605784D78D42b5507Be14D6533a835E2692A16',
    '0x00d078c7e058bA5106878b9e0CC09Ef1BF510925',
    '0xcF133249342444781ac4Fd5C101a0874ef88BA3A',
    '0x8B9e246D217e94ff67EA2d48fC6299366D3f984b',
    '0xA06635050bA513B872a24F3316b68fdD98C424D3',
    '0xa7133b1e009e542ee5f6F6Dd786D9B35382600a2',
    '0xC8149CAc51AC1bb5009Dd71e50C54a7dec96aB30',
    '0xd9811CeD97545243a13608924d6648251B07ed1A'
  ];

  const TIMELOCK = '0xb3c3aE82358DF7fC0bd98629D5ed91767e45c337';
  const EXACT_ETA = '1619095980';











  const timelock = Timelock__factory.connect(TIMELOCK, (await ethers.getSigners())[0]);

  for(let i = 0; i < WORKERS.length; i++) {
    console.log(">> Timelock: Setting okStrats via Timelock");
    await timelock.queueTransaction(
      WORKERS[i], '0',
      'setStrategyOk(address[],bool)',
      ethers.utils.defaultAbiCoder.encode(
        ['address[]','bool'],
        [
          [STRATEGY], true
        ]
      ), EXACT_ETA
    );
    console.log("generate timelock.executeTransaction:")
    console.log(`await timelock.executeTransaction('${WORKERS[i]}', '0', 'setStrategyOk(address[],bool)', ethers.utils.defaultAbiCoder.encode(['address[]','bool'],[['${STRATEGY}'], true]), ${EXACT_ETA})`)
    console.log("✅ Done");
  }
};

export default func;
func.tags = ['TimelockUpdateAddStratWorkers'];